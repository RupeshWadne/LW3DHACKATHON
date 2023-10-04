export const getUsersProfile = `
import NewProfile from 0x80ea21971a7ab25b

pub fun main(add: Address): NewProfile.UserProfileInfo
{
  let publicCap = getAccount(add).getCapability(NewProfile.publicProfileStoragePath).borrow<&NewProfile.UserProfile{NewProfile.IUserProfilePublic}>() ?? panic("Can't find public path!");
  return publicCap.getUserProfileInfo();
}
`