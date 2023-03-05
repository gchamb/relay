import { functions } from "../app";
import { httpsCallable } from "firebase/functions";
import { CreateGameRequest, CreateGameResponse } from "../function-types/types";

export const createGame = httpsCallable<CreateGameRequest, CreateGameResponse>(functions, "createGame");