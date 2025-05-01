import {
  badData,
  badRequest,
  conflict,
  notFound,
  unauthorized,
} from "@hapi/boom";
import { JwtPayloads } from "../auth/types/auth.dto";
import { CommonService } from "../common/service";
import { DBDependenciesInjector } from "../../lib/DBDependenciesInjector/definition";
import { Profile } from "./types/user.dto";
import { Images, ImagesStore } from "../../types/images.dto";

export class UserService extends CommonService {
  private database: DBDependenciesInjector;

  constructor(database: DBDependenciesInjector) {
    super(database);
    this.database = database;
  }

  async changeUsername(payloads: JwtPayloads, username: string) {
    const { user } = await this.validateSessionWithUser(payloads, "Access");

    const existsUsername = await this.getUserByUsername(username);
    if (existsUsername) throw conflict("Username already taken");

    const updated = await this.database.queryOne(
      this.database.queries.user.updateUsername,
      [user.id, username]
    );
    if (!updated) throw badRequest("Error updating the username");

    return "Updated successfully";
  }

  async changeDescription(payloads: JwtPayloads, description: string) {
    const { user } = await this.validateSessionWithUser(payloads, "Access");

    const changed = await this.database.queryOne<Profile>(
      this.database.queries.user.profile.updateDescription,
      [user.id, description]
    );

    return "Updated Successfully";
  }

  async changeBirthDate(payloads: JwtPayloads, birthDate: string) {
    const { user } = await this.validateSessionWithUser(payloads, "Access");

    const isDate = Date.parse(birthDate);
    if (isNaN(isDate)) throw badRequest("Birth Date should be in a ISO format");

    const changed = await this.database.queryOne(
      this.database.queries.user.profile.updateBirthDate,
      [user.id, birthDate]
    );

    return "Update Successfully";
  }

  async changeProfileImage(
    payloads: JwtPayloads,
    storeId: number,
    imageUrls: string[]
  ) {
    const { accessTokenPayload, refreshTokenPayload } = payloads;

    const store = await this.database.queryOne<ImagesStore>(
      this.database.queries.images.stores.getById,
      [storeId]
    );
    if (!store) throw notFound("Store not found");

    const profile = await this.database.queryOne<Profile>(
      this.database.queries.user.profile.getProfileByUserId,
      [accessTokenPayload.uid]
    );
    if (!profile) throw unauthorized();

    const cover = await this.database.queryOne<Images>(
      this.database.queries.images.createRecord,
      [imageUrls[0], store.id]
    );
    if (!cover) throw badRequest("Some error happen");

    const setImage = await this.database.queryOne<Profile>(
      this.database.queries.user.profile.setCoverImage,
      [cover.id, accessTokenPayload.uid]
    );
    if (!setImage) throw badRequest("Some error happen");

    return "Image changed successfully";
  }

  async changeBackgroundImage(
    payloads: JwtPayloads,
    storeId: number,
    imageUrls: string[]
  ) {
    const { accessTokenPayload, refreshTokenPayload } = payloads;

    const store = await this.database.queryOne<ImagesStore>(
      this.database.queries.images.stores.getById,
      [storeId]
    );
    if (!store) throw notFound("Store not found");

    const profile = await this.database.queryOne<Profile>(
      this.database.queries.user.profile.getProfileByUserId,
      [accessTokenPayload.uid]
    );
    if (!profile) throw unauthorized();

    const cover = await this.database.queryOne<Images>(
      this.database.queries.images.createRecord,
      [imageUrls[0], store.id]
    );
    if (!cover) throw badRequest("Some error happen");

    const setImage = await this.database.queryOne<Profile>(
      this.database.queries.user.profile.setBackgroundImage,
      [cover.id, accessTokenPayload.uid]
    );
    if (!setImage) throw badRequest("Some error happen");

    return "Image changed successfully";
  }
}
