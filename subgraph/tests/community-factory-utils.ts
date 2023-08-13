import { newMockEvent } from "matchstick-as"
import { ethereum, Address } from "@graphprotocol/graph-ts"
import {
  NewCommunity,
  OwnershipTransferred,
  TreasuryUpdate
} from "../generated/CommunityFactory/CommunityFactory"

export function createNewCommunityEvent(community: Address): NewCommunity {
  let newCommunityEvent = changetype<NewCommunity>(newMockEvent())

  newCommunityEvent.parameters = new Array()

  newCommunityEvent.parameters.push(
    new ethereum.EventParam("community", ethereum.Value.fromAddress(community))
  )

  return newCommunityEvent
}

export function createOwnershipTransferredEvent(
  previousOwner: Address,
  newOwner: Address
): OwnershipTransferred {
  let ownershipTransferredEvent = changetype<OwnershipTransferred>(
    newMockEvent()
  )

  ownershipTransferredEvent.parameters = new Array()

  ownershipTransferredEvent.parameters.push(
    new ethereum.EventParam(
      "previousOwner",
      ethereum.Value.fromAddress(previousOwner)
    )
  )
  ownershipTransferredEvent.parameters.push(
    new ethereum.EventParam("newOwner", ethereum.Value.fromAddress(newOwner))
  )

  return ownershipTransferredEvent
}

export function createTreasuryUpdateEvent(
  newTreasury: Address
): TreasuryUpdate {
  let treasuryUpdateEvent = changetype<TreasuryUpdate>(newMockEvent())

  treasuryUpdateEvent.parameters = new Array()

  treasuryUpdateEvent.parameters.push(
    new ethereum.EventParam(
      "newTreasury",
      ethereum.Value.fromAddress(newTreasury)
    )
  )

  return treasuryUpdateEvent
}
