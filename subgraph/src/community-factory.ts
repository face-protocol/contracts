import { NewCommunity } from "../generated/CommunityFactory/CommunityFactory";
import { Community as CommunityEntity } from "../generated/schema";
import { Community as CommunityTemplate } from "../generated/templates";

export function handleNewCommunity(event: NewCommunity): void {
  // Create entity
  let entity = new CommunityEntity(event.params.community);
  entity.save();

  // Create template instance
  CommunityTemplate.create(event.params.community);
}
