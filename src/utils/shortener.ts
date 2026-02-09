import { isAvailable } from "../services/controller.ts";
import { cput } from "../services/controller.ts";

const ALPHABET = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

export async function createTinyURL(url: string, env: Env): Promise<string> {
    let available = false;
    let small_url = "";
    while (!available) {
        small_url = "";
        for (let i=0 ;i <= 7 ; i++) {
            small_url+=getRandomLetter();
        }
        available = await isAvailable(small_url, env);
    }
    let value = await cput(small_url, url, env);
    return small_url;
}

function getRandomIndex(max: number): number { // implement actually random num gen
    return Math.floor(Math.random() * max) + 1;
}

function getRandomLetter(): string {
    return ALPHABET.charAt(getRandomIndex(ALPHABET.length));
}