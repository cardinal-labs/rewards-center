use super::StakeBooster;
use crate::assert_payment_info;
use crate::errors::ErrorCode;
use crate::handle_payment;
use crate::handle_payment_amount;
use crate::Action;
use crate::PaymentInfo;
use crate::StakeEntry;
use crate::StakePool;
use anchor_lang::prelude::*;
use anchor_spl::token::Mint;

#[derive(AnchorSerialize, AnchorDeserialize)]
pub struct BoostStakeEntryIx {
    seconds_to_boost: u64,
}

#[derive(Accounts)]
pub struct BoostStakeEntryCtx<'info> {
    #[account(mut)]
    stake_booster: Box<Account<'info, StakeBooster>>,
    #[account(mut, constraint = stake_booster.stake_pool == stake_pool.key() @ ErrorCode::InvalidStakePool)]
    stake_pool: Box<Account<'info, StakePool>>,
    #[account(mut, constraint = stake_entry.pool == stake_pool.key() @ ErrorCode::InvalidStakeEntry)]
    stake_entry: Box<Account<'info, StakeEntry>>,
    #[account(constraint = stake_entry.stake_mint == stake_mint.key() @ ErrorCode::InvalidStakePool)]
    stake_mint: Box<Account<'info, Mint>>,
    system_program: Program<'info, System>,
}

pub fn handler(ctx: Context<BoostStakeEntryCtx>, ix: BoostStakeEntryIx) -> Result<()> {
    let stake_entry = &mut ctx.accounts.stake_entry;
    if stake_entry.last_staker == Pubkey::default() || stake_entry.amount == 0 {
        return Err(error!(ErrorCode::CannotBoostUnstakedToken));
    }

    if ctx.accounts.stake_mint.supply > 1 || stake_entry.amount > 1 {
        return Err(error!(ErrorCode::CannotBoostFungibleToken));
    }

    stake_entry.total_stake_seconds = stake_entry.total_stake_seconds.saturating_add(u128::try_from(ix.seconds_to_boost).expect("Number conversion error"));

    if stake_entry
        .total_stake_seconds
        .gt(&u128::try_from(Clock::get().unwrap().unix_timestamp.checked_sub(ctx.accounts.stake_booster.start_time_seconds).expect("Sub error")).expect("Number conversion error"))
    {
        return Err(error!(ErrorCode::CannotBoostMoreThanCurrentTime));
    }

    let remaining_accounts = &mut ctx.remaining_accounts.iter();
    let payment_info_account_info = next_account_info(remaining_accounts)?;
    assert_eq!(ctx.accounts.stake_booster.payment_info, payment_info_account_info.key());
    let payment_info_account = Account::<PaymentInfo>::try_from(payment_info_account_info)?;

    let payment_amount = ix
        .seconds_to_boost
        .checked_mul(payment_info_account.payment_amount)
        .expect("Multiplication error")
        .checked_div(u64::try_from(ctx.accounts.stake_booster.boost_seconds).expect("Number conversion error"))
        .expect("Division error");

    // handle payment
    handle_payment_amount(payment_info_account, remaining_accounts, Some(payment_amount))?;

    // handle action payment
    assert_payment_info(
        ctx.accounts.stake_booster.stake_pool.key(),
        Action::BoostStakeEntry,
        ctx.accounts.stake_booster.boost_action_payment_info,
    )?;
    handle_payment(ctx.accounts.stake_booster.boost_action_payment_info, remaining_accounts)?;
    Ok(())
}
