/**
 * This code was GENERATED using the solita package.
 * Please DO NOT EDIT THIS FILE, instead rerun solita to update it or write a wrapper to add functionality.
 *
 * See: https://github.com/metaplex-foundation/solita
 */

import * as beet from '@metaplex-foundation/beet'
export type InitRewardDistributorIx = {
  rewardAmount: beet.bignum
  rewardDurationSeconds: beet.bignum
  identifier: beet.bignum
  kind: number
  supply: beet.COption<beet.bignum>
  maxSupply: beet.COption<beet.bignum>
  defaultMultiplier: beet.COption<beet.bignum>
  multiplierDecimals: beet.COption<number>
  maxRewardSecondsReceived: beet.COption<beet.bignum>
}

/**
 * @category userTypes
 * @category generated
 */
export const initRewardDistributorIxBeet =
  new beet.FixableBeetArgsStruct<InitRewardDistributorIx>(
    [
      ['rewardAmount', beet.u64],
      ['rewardDurationSeconds', beet.u128],
      ['identifier', beet.u64],
      ['kind', beet.u8],
      ['supply', beet.coption(beet.u64)],
      ['maxSupply', beet.coption(beet.u64)],
      ['defaultMultiplier', beet.coption(beet.u64)],
      ['multiplierDecimals', beet.coption(beet.u8)],
      ['maxRewardSecondsReceived', beet.coption(beet.u128)],
    ],
    'InitRewardDistributorIx'
  )
