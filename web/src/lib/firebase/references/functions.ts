import { functions } from "../app";
import { httpsCallable } from "firebase/functions";
import {
  CreateGameRequest,
  CreateGameResponse,
  DeleteInviteRequest,
  InvitePlayerRequest,
  JoinGameRequest,
  StartGameRequest,
} from "../function-types/types";

export const createGame = httpsCallable<CreateGameRequest, CreateGameResponse>(functions, "createGame");
export const joinGame = httpsCallable<JoinGameRequest, void>(functions, "joinGame");
export const invitePlayer = httpsCallable<InvitePlayerRequest, void>(functions, "invitePlayer");
export const deleteInvite = httpsCallable<DeleteInviteRequest, void>(functions, "deleteInvite");
export const startGame = httpsCallable<StartGameRequest, void>(functions, "startGame");
