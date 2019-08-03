const extractDataAndCreateJSON = async exerciseHTML => {
    const children = [...exerciseHTML.children]

    const result = {
        name: '',
        equipment: '',
        type: '',
        targetMuscles: [],
        instructions: [],
        images: {
            thumbnails: []
        },
        external: {
            url: ''
        },
        level: '',
        rating: 0.0
    }

    // Isolates the div container containing the exercise imagesa
    const imageDiv = children.find(child => child.className.includes('imgs'))
    const imgs = [...imageDiv.children]
    imgs.forEach(img =>
        result.images.thumbnails.push({
            width: 275,
            height: 275,
            url: img.src
        })
    )

    // Extracts the name, equipment type, targeted muscle, and external url from details div element
    const domain = 'https://www.bodybuilding.com'
    const exerciseDescriptionDiv = children.find(child =>
        child.className.includes('nameEtc')
    )
    const exerciseDescriptionDivChildren = [...exerciseDescriptionDiv.children]

    const exerciseDescription = exerciseDescriptionDivChildren
        .map(node => [...node.children]) // Isolate exercise div's children
        .map(child => child[0]) // Extract element out of array
        .map((child, i) => {
            if (i === 0) result.external.url = domain + child.pathname
            return child.innerHTML.trim()
        })

    result.name = exerciseDescription[0]
    result.targetMuscles.push(exerciseDescription[1])
    result.equipment = exerciseDescription[2]

    // Extracts rating from rating div within the exercise list item
    const ratingDiv = children.find(child => child.className.includes('rating'))
    const ratingDivChildren = [...[...ratingDiv.children][0].children][0]
    result.rating = +ratingDivChildren.innerHTML.trim()

    // ===========================================================================
    // Extracts data from page displaying single exercise details

    const singleExerciseDetailHTML = await ws.scrape({
        // url: result.external.url
        url: '/exercises/single-exercise.html',
        proxy: false
    })

    const singleExerciseDetails = singleExerciseDetailHTML.querySelector(
        'section.ExDetail-section > div.grid-3.grid-12-s.grid-8-m'
    ).children[0].children

    const distributeDetails = [...singleExerciseDetails]
        .filter((e, i) => i === 0 || i === 3)
        .map(node => node.innerText.trim().replace(/\s/g, ''))
        .map(detail => detail.split(':'))
        .forEach(([key, value]) => (result[key.toLowerCase()] = value))

    const instructionListHTML = singleExerciseDetailHTML.querySelector(
        'ol.ExDetail-descriptionSteps'
    ).children

    const addInstructions = [...instructionListHTML].forEach(instruction => {
        result.instructions.push(instruction.innerText.trim())
    })

    return result
}
