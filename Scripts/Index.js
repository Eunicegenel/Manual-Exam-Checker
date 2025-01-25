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

async function saveScore() {
    const examName = document.getElementById('exam_name').value.trim();
    const score = document.getElementById('test_score').textContent;

    if (!examName) {
        alert('Please enter the exam name.');
        return;
    }

    try {
        const response = await fetch('http://localhost:3000/save-score', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({ examName, score }),
		});		

        const result = await response.json();
        if (response.ok) {
            alert(result.message);
        } else {
            alert(result.message || 'Failed to save the score.');
        }
    } catch (err) {
        console.error(err);
        alert('Error connecting to the server.');
    }
}

// Fetch and display scores in results_container
async function fetchScores() {
    try {
        const response = await fetch('http://localhost:3000/get-scores');
        if (!response.ok) {
            throw new Error('Failed to fetch scores');
        }
        const scores = await response.json();
        const resultsContainer = document.querySelector('.results_table');
        resultsContainer.innerHTML = ''; // Clear previous content

        if (scores.length === 0) {
            resultsContainer.innerHTML = '<p>No scores available.</p>';
            return;
        }

        const table = document.createElement('table');
        table.style.width = '100%';
        table.style.borderCollapse = 'collapse';

        // Create table headers
        const headerRow = document.createElement('tr');
        ['Exam Name', 'Score', 'Date'].forEach(headerText => {
            const th = document.createElement('th');
            th.textContent = headerText;
            th.style.border = '1px solid #ddd';
            th.style.padding = '8px';
            th.style.textAlign = 'left';
            th.style.backgroundColor = '#05a3d2';
            th.style.color = '#fff';
            headerRow.appendChild(th);
        });
        table.appendChild(headerRow);

        // Populate table rows
        scores.forEach(score => {
            const row = document.createElement('tr');
            ['examName', 'score', 'date'].forEach(key => {
                const td = document.createElement('td');
                td.textContent = key === 'date' ? new Date(score[key]).toLocaleDateString() : score[key];
                td.style.border = '1px solid #ddd';
                td.style.padding = '8px';
            row.appendChild(td);
            });
            table.appendChild(row);
        });

        resultsContainer.appendChild(table);
    } catch (err) {
        console.error(err);
        alert('Error fetching scores.');
    }
}

// Call fetchScores on page load
document.addEventListener('DOMContentLoaded', fetchScores);
