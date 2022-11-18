/**
 * This code was GENERATED using the solita package.
 * Please DO NOT EDIT THIS FILE, instead rerun solita to update it or write a wrapper to add functionality.
 *
 * See: https://github.com/metaplex-foundation/solita
 */

import * as web3 from '@solana/web3.js'
import * as beet from '@metaplex-foundation/beet'
import * as beetSolana from '@metaplex-foundation/beet-solana'

/**
 * Arguments used to create {@link ReceiptManager}
 * @category Accounts
 * @category generated
 */
export type ReceiptManagerArgs = {
  bump: number
  stakePool: web3.PublicKey
  authority: web3.PublicKey
  requiredStakeSeconds: beet.bignum
  stakeSecondsToUse: beet.bignum
  claimedReceiptsCounter: beet.bignum
  requiresAuthorization: boolean
  paymentInfo: web3.PublicKey
  claimActionPaymentInfo: web3.PublicKey
  name: string
  maxClaimedReceipts: beet.COption<beet.bignum>
}

export const receiptManagerDiscriminator = [
  153, 143, 251, 115, 216, 68, 70, 152,
]
/**
 * Holds the data for the {@link ReceiptManager} Account and provides de/serialization
 * functionality for that data
 *
 * @category Accounts
 * @category generated
 */
export class ReceiptManager implements ReceiptManagerArgs {
  private constructor(
    readonly bump: number,
    readonly stakePool: web3.PublicKey,
    readonly authority: web3.PublicKey,
    readonly requiredStakeSeconds: beet.bignum,
    readonly stakeSecondsToUse: beet.bignum,
    readonly claimedReceiptsCounter: beet.bignum,
    readonly requiresAuthorization: boolean,
    readonly paymentInfo: web3.PublicKey,
    readonly claimActionPaymentInfo: web3.PublicKey,
    readonly name: string,
    readonly maxClaimedReceipts: beet.COption<beet.bignum>
  ) {}

  /**
   * Creates a {@link ReceiptManager} instance from the provided args.
   */
  static fromArgs(args: ReceiptManagerArgs) {
    return new ReceiptManager(
      args.bump,
      args.stakePool,
      args.authority,
      args.requiredStakeSeconds,
      args.stakeSecondsToUse,
      args.claimedReceiptsCounter,
      args.requiresAuthorization,
      args.paymentInfo,
      args.claimActionPaymentInfo,
      args.name,
      args.maxClaimedReceipts
    )
  }

  /**
   * Deserializes the {@link ReceiptManager} from the data of the provided {@link web3.AccountInfo}.
   * @returns a tuple of the account data and the offset up to which the buffer was read to obtain it.
   */
  static fromAccountInfo(
    accountInfo: web3.AccountInfo<Buffer>,
    offset = 0
  ): [ReceiptManager, number] {
    return ReceiptManager.deserialize(accountInfo.data, offset)
  }

  /**
   * Retrieves the account info from the provided address and deserializes
   * the {@link ReceiptManager} from its data.
   *
   * @throws Error if no account info is found at the address or if deserialization fails
   */
  static async fromAccountAddress(
    connection: web3.Connection,
    address: web3.PublicKey
  ): Promise<ReceiptManager> {
    const accountInfo = await connection.getAccountInfo(address)
    if (accountInfo == null) {
      throw new Error(`Unable to find ReceiptManager account at ${address}`)
    }
    return ReceiptManager.fromAccountInfo(accountInfo, 0)[0]
  }

  /**
   * Provides a {@link web3.Connection.getProgramAccounts} config builder,
   * to fetch accounts matching filters that can be specified via that builder.
   *
   * @param programId - the program that owns the accounts we are filtering
   */
  static gpaBuilder(
    programId: web3.PublicKey = new web3.PublicKey(
      'rwcn6Ry17ChPXpJCN2hoK5kwpgFarQqzycXwVJ3om7U'
    )
  ) {
    return beetSolana.GpaBuilder.fromStruct(programId, receiptManagerBeet)
  }

  /**
   * Deserializes the {@link ReceiptManager} from the provided data Buffer.
   * @returns a tuple of the account data and the offset up to which the buffer was read to obtain it.
   */
  static deserialize(buf: Buffer, offset = 0): [ReceiptManager, number] {
    return receiptManagerBeet.deserialize(buf, offset)
  }

  /**
   * Serializes the {@link ReceiptManager} into a Buffer.
   * @returns a tuple of the created Buffer and the offset up to which the buffer was written to store it.
   */
  serialize(): [Buffer, number] {
    return receiptManagerBeet.serialize({
      accountDiscriminator: receiptManagerDiscriminator,
      ...this,
    })
  }

  /**
   * Returns the byteSize of a {@link Buffer} holding the serialized data of
   * {@link ReceiptManager} for the provided args.
   *
   * @param args need to be provided since the byte size for this account
   * depends on them
   */
  static byteSize(args: ReceiptManagerArgs) {
    const instance = ReceiptManager.fromArgs(args)
    return receiptManagerBeet.toFixedFromValue({
      accountDiscriminator: receiptManagerDiscriminator,
      ...instance,
    }).byteSize
  }

  /**
   * Fetches the minimum balance needed to exempt an account holding
   * {@link ReceiptManager} data from rent
   *
   * @param args need to be provided since the byte size for this account
   * depends on them
   * @param connection used to retrieve the rent exemption information
   */
  static async getMinimumBalanceForRentExemption(
    args: ReceiptManagerArgs,
    connection: web3.Connection,
    commitment?: web3.Commitment
  ): Promise<number> {
    return connection.getMinimumBalanceForRentExemption(
      ReceiptManager.byteSize(args),
      commitment
    )
  }

  /**
   * Returns a readable version of {@link ReceiptManager} properties
   * and can be used to convert to JSON and/or logging
   */
  pretty() {
    return {
      bump: this.bump,
      stakePool: this.stakePool.toBase58(),
      authority: this.authority.toBase58(),
      requiredStakeSeconds: (() => {
        const x = <{ toNumber: () => number }>this.requiredStakeSeconds
        if (typeof x.toNumber === 'function') {
          try {
            return x.toNumber()
          } catch (_) {
            return x
          }
        }
        return x
      })(),
      stakeSecondsToUse: (() => {
        const x = <{ toNumber: () => number }>this.stakeSecondsToUse
        if (typeof x.toNumber === 'function') {
          try {
            return x.toNumber()
          } catch (_) {
            return x
          }
        }
        return x
      })(),
      claimedReceiptsCounter: (() => {
        const x = <{ toNumber: () => number }>this.claimedReceiptsCounter
        if (typeof x.toNumber === 'function') {
          try {
            return x.toNumber()
          } catch (_) {
            return x
          }
        }
        return x
      })(),
      requiresAuthorization: this.requiresAuthorization,
      paymentInfo: this.paymentInfo.toBase58(),
      claimActionPaymentInfo: this.claimActionPaymentInfo.toBase58(),
      name: this.name,
      maxClaimedReceipts: this.maxClaimedReceipts,
    }
  }
}

/**
 * @category Accounts
 * @category generated
 */
export const receiptManagerBeet = new beet.FixableBeetStruct<
  ReceiptManager,
  ReceiptManagerArgs & {
    accountDiscriminator: number[] /* size: 8 */
  }
>(
  [
    ['accountDiscriminator', beet.uniformFixedSizeArray(beet.u8, 8)],
    ['bump', beet.u8],
    ['stakePool', beetSolana.publicKey],
    ['authority', beetSolana.publicKey],
    ['requiredStakeSeconds', beet.u128],
    ['stakeSecondsToUse', beet.u128],
    ['claimedReceiptsCounter', beet.u128],
    ['requiresAuthorization', beet.bool],
    ['paymentInfo', beetSolana.publicKey],
    ['claimActionPaymentInfo', beetSolana.publicKey],
    ['name', beet.utf8String],
    ['maxClaimedReceipts', beet.coption(beet.u128)],
  ],
  ReceiptManager.fromArgs,
  'ReceiptManager'
)
