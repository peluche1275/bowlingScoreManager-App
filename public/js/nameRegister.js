class nameRegister {
    constructor() {
        this.form = document.getElementById("enterPlayerNameForm")
        this.submitButton = document.getElementById("enterPlayerNameButton")
    }

    displayNameFields(numberOfPlayers) {
        for (let i = 0; i < numberOfPlayers; i++) {
            const label = document.getElementById("label_" + i)
            const input = document.getElementById("input_" + i)

            label.style.display = "block"
            input.style.display = "block"
        }
        this.form.style.display = "flex"
    }

    checkIfThePlayersNamesAreValid(numberOfPlayers) {
        for (let i = 0; i < numberOfPlayers; i++) {
            const input = document.getElementById("input_" + i).value

            let validName = input.match(/^[a-zA-Z]\w{3,20}$/g) // The string must be between 4 and 20 characters long. It accepts letters and numbers. No spaces or special characters.
            if (validName === null) {
                return false
            }
        }
        return true
    }
}