use crate::errors::ErrorCode;
use anchor_lang::prelude::*;

use crate::Auction;
use crate::StakeEntry;
use crate::StakePool;

#[derive(Accounts)]
#[instruction(bidding_amount: u64)]
pub struct BidCtx<'info> {
    #[account(mut)]
    auction: Box<Account<'info, Auction>>,
    stake_pool: Box<Account<'info, StakePool>>,

    #[account(mut, constraint = stake_entry.pool == stake_pool.key() && stake_entry.last_staker == bidder.key() @ ErrorCode::InvalidStakeEntry)]
    stake_entry: Box<Account<'info, StakeEntry>>,
    #[account(mut, constraint = highest_bidding_stake_entry.key() == auction.highest_bidding_stake_entry @ ErrorCode::InvalidHighestBiddingStakeEntry)]
    highest_bidding_stake_entry: Box<Account<'info, StakeEntry>>,

    #[account(mut)]
    bidder: Signer<'info>,

    system_program: Program<'info, System>,
}

pub fn handler(ctx: Context<BidCtx>, bidding_amount: u128) -> Result<()> {
    if bidding_amount < ctx.accounts.auction.highest_bid {
        return Err(error!(ErrorCode::NotHighestBid));
    }

    let timestamp = Clock::get()?.unix_timestamp;
    if timestamp > ctx.accounts.auction.end_date {
        return Err(error!(ErrorCode::AuctionEnded));
    }

    if bidding_amount > ctx.accounts.stake_entry.total_stake_seconds - ctx.accounts.stake_entry.used_stake_seconds {
        return Err(error!(ErrorCode::NotEnoughStakeSeconds));
    }

    ctx.accounts.highest_bidding_stake_entry.used_stake_seconds = ctx
        .accounts
        .highest_bidding_stake_entry
        .used_stake_seconds
        .checked_sub(ctx.accounts.auction.highest_bid)
        .expect("sub error");
    ctx.accounts.auction.highest_bid = bidding_amount;
    ctx.accounts.auction.highest_bidding_stake_entry = ctx.accounts.stake_entry.key();
    ctx.accounts.stake_entry.used_stake_seconds = ctx.accounts.stake_entry.used_stake_seconds.checked_add(bidding_amount).expect("Add error");

    Ok(())
}
