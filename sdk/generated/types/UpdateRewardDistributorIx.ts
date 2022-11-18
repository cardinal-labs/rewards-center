/**
 * This code was GENERATED using the solita package.
 * Please DO NOT EDIT THIS FILE, instead rerun solita to update it or write a wrapper to add functionality.
 *
 * See: https://github.com/metaplex-foundation/solita
 */

import * as beet from '@metaplex-foundation/beet'
import * as web3 from '@solana/web3.js'
import * as beetSolana from '@metaplex-foundation/beet-solana'
export type UpdateRewardDistributorIx = {
  defaultMultiplier: beet.bignum
  multiplierDecimals: number
  rewardAmount: beet.bignum
  rewardDurationSeconds: beet.bignum
  maxRewardSecondsReceived: beet.COption<beet.bignum>
  claimRewardsPaymentInfo: web3.PublicKey
}

/**
 * @category userTypes
 * @category generated
 */
export const updateRewardDistributorIxBeet =
  new beet.FixableBeetArgsStruct<UpdateRewardDistributorIx>(
    [
      ['defaultMultiplier', beet.u64],
      ['multiplierDecimals', beet.u8],
      ['rewardAmount', beet.u64],
      ['rewardDurationSeconds', beet.u128],
      ['maxRewardSecondsReceived', beet.coption(beet.u128)],
      ['claimRewardsPaymentInfo', beetSolana.publicKey],
    ],
    'UpdateRewardDistributorIx'
  )
