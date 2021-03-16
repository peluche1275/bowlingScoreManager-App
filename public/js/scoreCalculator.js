class scoreCalculator {
    constructor() {}

    returnThePlayerThrow(itIsTheSecondThrow, score, IndexOfSlotToFill, objet) {
        const previousThrow = objet.throwHistory[objet.throwHistory.length - 1];
        const pair = this.checkIfItIsAPair(itIsTheSecondThrow, score, previousThrow)
        const strike = this.checkIfItIsAStrike(score, objet.throwHistory, IndexOfSlotToFill)

        if (pair) {
            score = "/"
        } else if (strike) {
            score = "X"
        }
        return score;
    }

    checkIfThePlayerCanPlay(IndexOfSlotToFill, throwHistory) {
        let playerCanDoTheNextThrow = true
        if (IndexOfSlotToFill === 20) {
            if ((throwHistory[throwHistory.length - 1] + throwHistory[throwHistory.length - 2]) < 10) {
                playerCanDoTheNextThrow = false
            }
        }
        return playerCanDoTheNextThrow
    }

    checkIfItIsAStrike(score, throwHistory, IndexOfSlotToFill) {
        let itIsAStrike = false;

        if (score === 10) {
            if (throwHistory[throwHistory.length - 1] === 0 && (IndexOfSlotToFill % 2) != 0) {
                console.log("NO PROBLEM")
            } else {
                itIsAStrike = true;
            }
        }
        return itIsAStrike;
    }

    checkIfItIsAPair(itIsTheSecondThrow, score, previousThrow) {
        let itIsAPair = false
        if (itIsTheSecondThrow && (score + previousThrow) === 10) {
            itIsAPair = true
        }
        return itIsAPair
    }

    checkIfThePlayerCanEnterThisScore(score, previousThrow, IndexOfSlotToFill) {
        let validScore = true;
        if ((score + previousThrow) > 10 || previousThrow === "X" && IndexOfSlotToFill < 18) {
            validScore = false;
        }
        return validScore;
    }

    pushTheScoreInTheThrowHistory(throwHistory, score) {
        if (score == "/") {
            score = 10 - throwHistory[throwHistory.length - 1]
        }

        throwHistory.push(score);
    }

    checkIfItIsTheSecondThrow(IndexOfSlotToFill) {
        let itIsTheSecondThrow = false;
        if (IndexOfSlotToFill % 2 != 0) {
            itIsTheSecondThrow = true;
        }
        return itIsTheSecondThrow;
    }

    returnTheFrameScore(indexOfTheFirstThrowOfTheCurrentFrame, objet) {
        const firstThrow = objet.throwHistory[indexOfTheFirstThrowOfTheCurrentFrame];
        const secondThrow = objet.throwHistory[indexOfTheFirstThrowOfTheCurrentFrame + 1];
        const thirdThrow = objet.throwHistory[indexOfTheFirstThrowOfTheCurrentFrame + 2];
        const currentFrame = firstThrow + secondThrow;

        let canNotCalculate = false;
        let score = undefined;

        if (firstThrow === "X") {
            if (secondThrow != null && thirdThrow != null) {
                score = this.defineStrikeScore(objet, indexOfTheFirstThrowOfTheCurrentFrame);
            } else {
                canNotCalculate = true;
            }
        }

        if (firstThrow != null && secondThrow != null) {
            if (currentFrame === 10) {
                if (thirdThrow != null) {
                    score = this.defineScoreWithTheThrirdThrow(thirdThrow, objet);
                } else {
                    canNotCalculate = true;
                }
            }
        } else {
            canNotCalculate = true
        }

        if (canNotCalculate == true) {
            score = undefined
        } else if (score == undefined) {
            objet.frameHistory.push(currentFrame)
            objet.indexOfTheFirstThrowOfTheCurrentFrame += 2;
            score = objet.frameHistory[objet.frameHistory.length - 1]
        }
        return score
    }

    defineScoreWithTheThrirdThrow(thirdThrow, objet) {
        if (thirdThrow === "X") {
            objet.frameHistory.push(20);
        } else {
            objet.frameHistory.push((10 + thirdThrow));
        }
        objet.indexOfTheFirstThrowOfTheCurrentFrame += 2;
        return objet.frameHistory[objet.frameHistory.length - 1];
    }

    defineStrikeScore(objet, indexOfTheFirstThrowOfTheCurrentFrame) {
        let sumOfFrameScores = 0;
        for (let i = 0; i < 3; i++) {
            if (objet.throwHistory[indexOfTheFirstThrowOfTheCurrentFrame + i] === "X") {
                sumOfFrameScores += 10;
            } else {
                sumOfFrameScores += objet.throwHistory[indexOfTheFirstThrowOfTheCurrentFrame + i];
            }
        }
        objet.frameHistory.push(sumOfFrameScores);
        objet.indexOfTheFirstThrowOfTheCurrentFrame += 1;
        return objet.frameHistory[objet.frameHistory.length - 1];
    }

    calculateActualTotalScore(objet) {
        const frameHistory = objet.frameHistory;
        let totalScore = 0;

        for (let i = 0; i < frameHistory.length; i++) {
            totalScore += frameHistory[i]
        }
        return totalScore;
    }

    determinateDate() {
        let current = new Date()
        let month = (current.getMonth() + 1)
        if (month < 10) {
            month = "0" + month
        }
        return (current.getDate() + "/" + month + "/" + current.getFullYear())
    }

    checkCondition(throwInformation) {
        return {
            itIsTheSecondThrow: this.checkIfItIsTheSecondThrow(throwInformation.IndexOfSlotToFill),
            playerCanPlay: this.checkIfThePlayerCanPlay(throwInformation.IndexOfSlotToFill, throwInformation.throwHistory),
            validScore: this.checkIfThePlayerCanEnterThisScore(throwInformation.score, throwInformation.previousThrow, throwInformation.IndexOfSlotToFill)
        }

    }

    determinateIfPlayerCantDoTheThrow(checkCondition) {
        let errorMessage = null

        if (checkCondition.playerCanPlay === false) {
            errorMessage = "Vous avez atteint le nombre maximal de lancer"
        } else if (checkCondition.itIsTheSecondThrow && checkCondition.validScore == false) {
            errorMessage = "Vous avez ne pouvez pas faire tomber autant de quille"
        }

        return errorMessage
    }
}