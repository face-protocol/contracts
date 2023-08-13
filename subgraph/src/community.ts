import {
  Initialized,
  NewMembership,
  Community as CommunityContract,
} from "../generated/templates/Community/Community";
import {
  Community as CommunityEntity,
  CommunityMember,
} from "../generated/schema";

export function handleInitialized(event: Initialized): void {
  let communityEntity = CommunityEntity.load(event.address)!;
  let communityContract = CommunityContract.bind(event.address);

  communityEntity.name = communityContract.name();
  communityEntity.symbol = communityContract.symbol();
  communityEntity.rulesURI = communityContract.rulesURI();

  communityEntity.save();
}

export function handleNewMembership(event: NewMembership): void {
  let communityContract = CommunityContract.bind(event.address);

  let membership = new CommunityMember(
    event.address.concat(event.params.member)
  );
  membership.community = event.address;
  membership.member = event.params.member;
  membership.tokenId = event.params.tokenId;
  membership.dataURI = communityContract
    .applications(event.params.member)
    .getDataURI();
  membership.save();
}
