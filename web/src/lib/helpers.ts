import { ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { Room } from "./firebase/firestore-types/game";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function properCase(name: string) {
  const firstChar = name.charAt(0).toUpperCase();
  return firstChar + name.substring(1, name.length).toLowerCase();
}

export function generateOptions(
  numOne: number,
  numTwo: number,
  operation: Room["operation"]
): { options: [number, number, number]; answer: number } {
  // TODO: make sure the answer isn't doupicated twice
  // TODO: make sure only answers to the second decimal place
  switch (operation) {
    case "+":
      const answerAdd = numOne + numTwo;
      const optionAddOne = Math.floor(numOne + Math.random() * answerAdd);
      const optionAddTwo = Math.floor(numTwo + Math.random() * answerAdd);

      return { options: [optionAddOne, optionAddTwo, answerAdd], answer: answerAdd };
    case "-":
      const answerSub = numOne - numTwo;
      const optionSubOne = Math.floor(numOne + Math.random() * answerSub);
      const optionSubTwo = Math.floor(numTwo + Math.random() * answerSub);

      return { options: [optionSubOne, optionSubTwo, answerSub], answer: answerSub };
    case "x":
      const answerMult = numOne * numTwo;
      const optionMultOne = Math.floor(numOne + Math.random() * answerMult);
      const optionMultTwo = Math.floor(numTwo + Math.random() * answerMult);

      return { options: [optionMultOne, optionMultTwo, answerMult], answer: answerMult };

    case "÷":
      const answerDiv = numOne / numTwo;
      const optionDivOne = Math.floor(numOne + Math.random() * answerDiv);
      const optionDivTwo = Math.floor(numTwo + Math.random() * answerDiv);

      return { options: [optionDivOne, optionDivTwo, answerDiv], answer: answerDiv };
  }
}

/**
 *
 * @param array
 * @returns shuffles the current elements in the array
 * @note uses the Richard Durstenfeld algorithm to shuffle
 */
export function shuffle<T>(array: T[]): T[] {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (1 + i));
    const temp = array[i];
    array[i] = array[j];
    array[j] = temp;
  }

  return array;
}
