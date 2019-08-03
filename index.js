const ws = new WebScraper()

const main = async () => {
    // Keywords for bodybuilding.com
    const muscleGroups = []

    try {
        // Extracts HTML for exercises for particular muscle group
        const exerciseListHTML = await Promise.all(
            muscleGroups.map(muscle => fetchExerciseListHTML(muscle))
        )

        // Iterates through the array of exercise HTML arrays of a single muscle group
        const exerciseListJSON = await Promise.all(
            exerciseListHTML.map(singleMuscleGroupExerciseListHTML => {
                return Promise.all(
                    singleMuscleGroupExerciseListHTML.map(exerciseHTML => {
                        return extractDataAndCreateJSON(exerciseHTML)
                    })
                )
            })
        )

        // Flattens array of arrays into one single array.
        const flattened = []
        exerciseListJSON.forEach(arr => flattened.push(...arr))

        let timeout = 1000
        // This process makes POST requests and attempts to bulk create
        // created exercise instances.
        await Promise.all(
            flattened.map((exercise, i) => {
                return setTimeout(() => {
                    createInstance(exercise, i)
                    timeout += Math.random * 500
                }, i * timeout)
            })
        )
    } catch (err) {
        console.error(err)
    }
}

const createInstance = (body, i) => {
    const now = new Date()
    const convert = n => (Math.floor(n / 10) ? `${n}` : `0${n}`)

    const startTime =
        convert(now.getHours()) +
        ':' +
        convert(now.getMinutes()) +
        ':' +
        convert(now.getSeconds())

    console.log(
        `${i + 1}. Request to create ${body.name} started at ${startTime}.`
    )

    return fetch('http://localhost:5000/v1/exercises', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: ''
        },
        body: JSON.stringify(body)
    }).then(res => res.json())
}
