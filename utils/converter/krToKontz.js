import {
    disassembleCompleteCharacter,
} from "es-hangul";

import {
    initialConsToKontz,
    InitialVowelToKontz,
    finalConsToKontz,
} from "../constants/sybKR.js";

const VOICED = {
    "ㄱ": "г",
    "ㄷ": "д",
    "ㅂ": "б",
    "ㅈ": "дж",
};

const NASALS = ["ㄴ", "ㅁ"];
const SONORANTS = ["ㄴ", "ㅇ", "ㅁ", "ㄹ"];

function disassembleWord(word) {
    return Array.from(word, (char) => {
        const syllable = disassembleCompleteCharacter(char);
        return syllable ? { ...syllable } : null;
    });
}

function applySoundRules(syllables) {
    // 1. Носовая ассимиляция:
    // ㄱ, ㄲ, ㅋ перед ㄴ/ㅁ -> ㅇ.
    for (let i = 0; i < syllables.length - 1; i++) {
        const current = syllables[i];
        const next = syllables[i + 1];

        if (
            current &&
            next &&
            ["ㄱ", "ㄲ", "ㅋ"].includes(current.jongseong) &&
            NASALS.includes(next.choseong)
        ) {
            current.jongseong = "ㅇ";
        }
    }

    // 2. ㄴ + ㄹ и ㄹ + ㄴ -> ㄹ + ㄹ.
    for (let i = 0; i < syllables.length - 1; i++) {
        const current = syllables[i];
        const next = syllables[i + 1];

        if (!current || !next) continue;

        if (
            current.jongseong === "ㄴ" &&
            next.choseong === "ㄹ"
        ) {
            current.jongseong = "ㄹ";
        }

        if (
            current.jongseong === "ㄹ" &&
            next.choseong === "ㄴ"
        ) {
            next.choseong = "ㄹ";
        }
    }

    // 3. ㅂ + ㄹ -> ㅁ + ㄴ.
    for (let i = 0; i < syllables.length - 1; i++) {
        const current = syllables[i];
        const next = syllables[i + 1];

        if (
            current &&
            next &&
            current.jongseong === "ㅂ" &&
            next.choseong === "ㄹ"
        ) {
            current.jongseong = "ㅁ";
            next.choseong = "ㄴ";
        }
    }

    // 4. ㄶ перед гласной:
    // ㅎ исчезает, ㄴ переносится.
    for (let i = 0; i < syllables.length - 1; i++) {
        const current = syllables[i];
        const next = syllables[i + 1];

        if (
            current &&
            next &&
            current.jongseong === "ㄴㅎ" &&
            next.choseong === "ㅇ"
        ) {
            current.jongseong = "";
            next.choseong = "ㄴ";
        }
    }

    // 5. ㄹㅎ перед ㅈ:
    // сохраняем ㄹ, не добавляем отдельный звук ㅎ.
    for (let i = 0; i < syllables.length - 1; i++) {
        const current = syllables[i];
        const next = syllables[i + 1];

        if (
            current &&
            next &&
            current.jongseong === "ㄹㅎ" &&
            next.choseong === "ㅈ"
        ) {
            current.jongseong = "ㄹ";
        }
    }

    // 6. Лиазон: перенос простого патчима
    // в следующий слог с начальным ㅇ.
    // Составные патчимы целиком не переносим.
    for (let i = 0; i < syllables.length - 1; i++) {
        const current = syllables[i];
        const next = syllables[i + 1];

        if (
            !current ||
            !next ||
            next.choseong !== "ㅇ" ||
            !current.jongseong ||
            current.jongseong.length !== 1 ||
            current.jongseong === "ㅇ"
        ) {
            continue;
        }

        if (current.jongseong === "ㅎ") {
            current.jongseong = "";
            continue;
        }

        next.choseong = current.jongseong;
        current.jongseong = "";
    }

    return syllables;
}

function transliterateSyllables(syllables) {
    return syllables.map((current, i) => {
        if (!current) return "";

        const prev = syllables[i - 1];
        const next = syllables[i + 1];

        const {
            choseong,
            jungseong,
            jongseong,
        } = current;

        let ruInitial = initialConsToKontz[choseong] ?? "";

        // Озвончение внутри слова.
        if (prev) {
            const prevFinal = prev.jongseong;

            const canVoice =
            !prevFinal || SONORANTS.includes(prevFinal);

            // ㅈ после ㄹ оставляем как "ч":
            // 발전했다 -> пальчонхэтта.
            if (
                canVoice &&
                VOICED[choseong] &&
                !(choseong === "ㅈ" && prevFinal === "ㄹ")
            ) {
                ruInitial = VOICED[choseong];
            }

            // 신라 -> силла.
            if (
                choseong === "ㄹ" &&
                prevFinal === "ㄹ"
            ) {
                ruInitial = "л";
            }
        }

        let ruVowel =
        InitialVowelToKontz[jungseong] ?? "";

        // 의 передаём по твоей системе:
        // 형의 -> хёнъи; 라의 -> ла-и.
        if (jungseong === "ㅢ" || jungseong === "ㅡㅣ") {
            ruVowel = prev?.jongseong === "ㅇ" ? "ъи" : "и";
        }

        let ruFinal = "";

        if (jongseong === "ㄹ" && next?.choseong === "ㄹ") {
            // Не смягчаем первый л в сочетании ㄹㄹ.
            ruFinal = "л";
        } else {
            ruFinal = finalConsToKontz[jongseong] ?? "";
        }

        return ruInitial + ruVowel + ruFinal;
    }).join("");
}

function transliterateWord(word) {
    const syllables = disassembleWord(word);

    applySoundRules(syllables);

    return transliterateSyllables(syllables);
}

export function krToKontz(text = "사과") {
    // Обрабатываем каждое корейское слово отдельно,
    // сохраняя пробелы и пунктуацию.
    return text.replace(/[가-힣]+/gu, transliterateWord);
}

console.log(
    krToKontz(
        "국물에 밥을 말아 밭이 많은 꽃밭에서 짚신을 신고 읽던 책을 잃지 않으려고, 굳이 몇몇 사람들과 협력하여 맏형의 몫을 밟다 보니 밤낮으로 신라의 학문이 발전했다."
    )
);
