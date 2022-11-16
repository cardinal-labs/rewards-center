use crate::errors::ErrorCode;
use crate::escrow_seeds;
use crate::handle_stake_pool_payment;
use crate::stake_entry::increment_total_stake_seconds;
use crate::StakeEntry;
use crate::StakePool;
use anchor_lang::prelude::*;
use anchor_spl::token::Mint;
use anchor_spl::token::Revoke;
use anchor_spl::token::Token;
use anchor_spl::token::TokenAccount;
use anchor_spl::token::{self};
use mpl_token_metadata::instruction::thaw_delegated_account;
use solana_program::program::invoke_signed;

#[derive(Accounts)]
pub struct UnstakeEditionCtx<'info> {
    #[account(mut, constraint = stake_entry.pool == stake_pool.key() @ ErrorCode::InvalidStakePool)]
    stake_pool: Box<Account<'info, StakePool>>,
    #[account(mut)]
    stake_entry: Box<Account<'info, StakeEntry>>,

    #[account(constraint = stake_entry.stake_mint == stake_mint.key() @ ErrorCode::InvalidStakeEntry)]
    stake_mint: Box<Account<'info, Mint>>,
    /// CHECK: This is not dangerous because we don't read or write from this account
    stake_mint_edition: UncheckedAccount<'info>,

    // user
    #[account(mut, constraint = user.key() == stake_entry.last_staker @ ErrorCode::InvalidLastStaker)]
    user: Signer<'info>,
    /// CHECK: This is not dangerous because we don't read or write from this account
    #[account(mut)]
    user_escrow: UncheckedAccount<'info>,
    #[account(mut, constraint =
        user_stake_mint_token_account.amount > 0
        && user_stake_mint_token_account.mint == stake_entry.stake_mint
        && user_stake_mint_token_account.owner == user.key()
        @ ErrorCode::InvalidUserStakeMintTokenAccount
    )]
    user_stake_mint_token_account: Box<Account<'info, TokenAccount>>,

    /// CHECK: This is not dangerous because we don't read or write from this account
    #[account(address = mpl_token_metadata::id())]
    token_metadata_program: UncheckedAccount<'info>,
    token_program: Program<'info, Token>,
    system_program: Program<'info, System>,
}

pub fn handler<'key, 'accounts, 'remaining, 'info>(ctx: Context<'key, 'accounts, 'remaining, 'info, UnstakeEditionCtx<'info>>) -> Result<()> {
    let stake_pool = &mut ctx.accounts.stake_pool;
    let stake_entry = &mut ctx.accounts.stake_entry;

    let user = ctx.accounts.user.key();
    let user_escrow = ctx.accounts.user_escrow.key();
    let escrow_seeds = escrow_seeds(&stake_pool.key(), &user, &user_escrow)?;

    //// FEATURE: Minimum stake seconds
    if stake_pool.min_stake_seconds.is_some()
        && stake_pool.min_stake_seconds.unwrap() > 0
        && ((Clock::get().unwrap().unix_timestamp - stake_entry.last_staked_at) as u32) < stake_pool.min_stake_seconds.unwrap()
    {
        return Err(error!(ErrorCode::MinStakeSecondsNotSatisfied));
    }

    //// FEATURE: Cooldown
    if stake_pool.cooldown_seconds.is_some() && stake_pool.cooldown_seconds.unwrap() > 0 {
        if stake_entry.cooldown_start_seconds.is_none() {
            stake_entry.cooldown_start_seconds = Some(Clock::get().unwrap().unix_timestamp);
            return Ok(());
        } else if stake_entry.cooldown_start_seconds.is_some() && ((Clock::get().unwrap().unix_timestamp - stake_entry.cooldown_start_seconds.unwrap()) as u32) < stake_pool.cooldown_seconds.unwrap() {
            return Err(error!(ErrorCode::CooldownSecondRemaining));
        }
    }

    invoke_signed(
        &thaw_delegated_account(
            ctx.accounts.token_metadata_program.key(),
            user_escrow,
            ctx.accounts.user_stake_mint_token_account.key(),
            ctx.accounts.stake_mint_edition.key(),
            ctx.accounts.stake_mint.key(),
        ),
        &[
            ctx.accounts.user_escrow.to_account_info(),
            ctx.accounts.user_stake_mint_token_account.to_account_info(),
            ctx.accounts.stake_mint_edition.to_account_info(),
            ctx.accounts.stake_mint.to_account_info(),
        ],
        &[&escrow_seeds.iter().map(|s| s.as_slice()).collect::<Vec<&[u8]>>()],
    )?;

    let cpi_accounts = Revoke {
        source: ctx.accounts.user_stake_mint_token_account.to_account_info(),
        authority: ctx.accounts.user.to_account_info(),
    };
    let cpi_program = ctx.accounts.token_program.to_account_info();
    let cpi_context = CpiContext::new(cpi_program, cpi_accounts);
    token::revoke(cpi_context)?;

    // handle payment
    let remaining_accounts = &mut ctx.remaining_accounts.iter();
    if let (Some(payment_mint), Some(payment_amount), Some(payment_manager), Some(payment_recipient)) =
        (stake_pool.payment_mint, stake_pool.unstake_payment_amount, stake_pool.payment_manager, stake_pool.payment_recipient)
    {
        handle_stake_pool_payment(
            payment_mint,
            payment_amount,
            payment_manager,
            payment_recipient,
            &ctx.accounts.token_program.to_account_info(),
            remaining_accounts,
        )?;
    }

    increment_total_stake_seconds(stake_entry)?;
    stake_entry.last_staker = Pubkey::default();
    stake_entry.amount = 0;
    stake_entry.cooldown_start_seconds = None;
    stake_pool.total_staked = stake_pool.total_staked.checked_sub(1).expect("Sub error");
    if stake_pool.reset_on_unstake {
        stake_entry.total_stake_seconds = 0;
    }
    Ok(())
}
