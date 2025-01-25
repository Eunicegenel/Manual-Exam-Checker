function generateQuestions() {
    const container = document.getElementById('question_container');
    container.innerHTML = ''; // Clear existing questions
    const numQuestions = parseInt(document.getElementById('number_of_questions').value);

    for (let i = 1; i <= numQuestions; i++) {
        const questionDiv = document.createElement('div');
        questionDiv.className = 'question';

        // Question Number
        const questionNumber = document.createElement('span');
        questionNumber.textContent = i;

        // Choices
        const choicesDiv = document.createElement('div');
        choicesDiv.className = 'questions_choices';
        for (let j = 1; j <= 5; j++) {
            // Create a wrapper for input and label
            const choiceWrapper = document.createElement('div');
            choiceWrapper.className = 'questions_choice';

            const choiceInput = document.createElement('input');
            choiceInput.type = 'radio';
            choiceInput.name = `question_${i}`;
            choiceInput.value = j;

            // Add event listener to update the background color
            choiceInput.addEventListener('change', () => markAnswered(questionDiv));

            const choiceLabel = document.createElement('label');
            choiceLabel.textContent = j;

            choiceWrapper.appendChild(choiceInput);
            choiceWrapper.appendChild(choiceLabel);
            choicesDiv.appendChild(choiceWrapper);
        }

        // Checkbox for marking answers
        const manualCheckbox = document.createElement('input');
        manualCheckbox.type = 'checkbox';
        manualCheckbox.dataset.question = i; // Associate with question
        manualCheckbox.addEventListener('change', updateScore); // Update score on change

        // Append elements to questionDiv
        questionDiv.appendChild(questionNumber);
        questionDiv.appendChild(choicesDiv);
        questionDiv.appendChild(manualCheckbox);

        // Append questionDiv to container
        container.appendChild(questionDiv);
    }

    // Reset score display
    document.getElementById('test_score').textContent = `Score: 0/${numQuestions}`;
}

function updateScore() {
    let score = 0;

    // Count all checked checkboxes
    const allCheckboxes = document.querySelectorAll('.question input[type="checkbox"]');
    allCheckboxes.forEach(cb => {
        if (cb.checked) score++;
    });

    // Update score display
    const totalQuestions = allCheckboxes.length;
    document.getElementById('test_score').textContent = `Score: ${score}/${totalQuestions}`;
}

function markAnswered(questionDiv) {
    // Add "answered" class to retain the highlight for this question
    questionDiv.classList.add('answered');
}