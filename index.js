const ws = new WebScraper()

const main = async () => {
    // Keywords for bodybuilding.com
    const muscleGroups = []

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

    exerciseListJSON.forEach(singleMuscleGroup => {
        singleMuscleGroup.forEach(exercise => {
            try {
                fetch('https://fitshare-web-api.herokuapp.com/v1/exercises', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: ''
                    },
                    body: JSON.stringify(exercise)
                })
            } catch (err) {
                console.log(err)
            }
        })
    })
}
