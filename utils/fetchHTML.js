const fetchExerciseListHTML = async muscleGroup => {
    const ws = new WebScraper()

    const htmlDoc = await ws.scrape({
        url: `/exercises/${muscleGroup}.html`,
        proxy: false
    })

    let exerciseList = htmlDoc.querySelectorAll('div.ExResult-row')
    exerciseList = [...exerciseList].filter(
        exercise => exercise.childElementCount === 3
    )

    return exerciseList
}
