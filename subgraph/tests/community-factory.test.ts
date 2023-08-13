import {
  assert,
  describe,
  test,
  clearStore,
  beforeAll,
  afterAll
} from "matchstick-as/assembly/index"
import { Address } from "@graphprotocol/graph-ts"
import { NewCommunity } from "../generated/schema"
import { NewCommunity as NewCommunityEvent } from "../generated/CommunityFactory/CommunityFactory"
import { handleNewCommunity } from "../src/community-factory"
import { createNewCommunityEvent } from "./community-factory-utils"

// Tests structure (matchstick-as >=0.5.0)
// https://thegraph.com/docs/en/developer/matchstick/#tests-structure-0-5-0

describe("Describe entity assertions", () => {
  beforeAll(() => {
    let community = Address.fromString(
      "0x0000000000000000000000000000000000000001"
    )
    let newNewCommunityEvent = createNewCommunityEvent(community)
    handleNewCommunity(newNewCommunityEvent)
  })

  afterAll(() => {
    clearStore()
  })

  // For more test scenarios, see:
  // https://thegraph.com/docs/en/developer/matchstick/#write-a-unit-test

  test("NewCommunity created and stored", () => {
    assert.entityCount("NewCommunity", 1)

    // 0xa16081f360e3847006db660bae1c6d1b2e17ec2a is the default address used in newMockEvent() function
    assert.fieldEquals(
      "NewCommunity",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1",
      "community",
      "0x0000000000000000000000000000000000000001"
    )

    // More assert options:
    // https://thegraph.com/docs/en/developer/matchstick/#asserts
  })
})
