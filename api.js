let AllData = [];
// Data fetch starts here
const fetchData = (sorting, dataLimit) => {
    fetch("https://openapi.programming-hero.com/api/ai/tools")
        .then(res => res.json()).then(data => {
            if (sorting) {
                const sortingData = data.data.tools.sort(sortByDate);
                displayData(sortingData, dataLimit);

            } else {
                displayData(data.data.tools, dataLimit);
            }
        })
    const spinnerSection = document.getElementById('spinner-section');
    spinnerSection.classList.remove('d-none');
}
// Fetch all data
document.getElementById('showAll').addEventListener('click', function () {
    fetchData(false);
});
// Sorting Data
document.getElementById('sortData').addEventListener('click', function () {
    if (AllData.length > 6) {
        fetchData(true);
    } else {
        fetchData(true, 6);
    }
})

// Display data starts here
const displayData = (data, dataLimit) => {
    const cardContainer = document.getElementById('cards-container');
    cardContainer.textContent = '';
    const showAll = document.getElementById('showAll');
    if (dataLimit && data.length > 6) {
        data = data.slice(0, 6);
        showAll.classList.remove('d-none');
    } else {
        showAll.classList.add('d-none');
        data.forEach(element => AllData.push(element));
    }

    data.forEach(element => {
        const { image, name, published_in, id } = element;
        const div = document.createElement('div');
        div.classList.add('col');
        div.innerHTML = `
        <div class="card shadow">
        <img src="${image}" class="card-img-top" alt="...">
        <div class="card-body">
            <h5 class="card-title">Features</h5>
            <ol id="${id}">
    
            </ol>
        </div>
        <div class="card-footer d-flex justify-content-between align-items-center">
           <div>
           <h6>${name}</h6>
           <small><span><i class="fa-solid fa-calendar-days"></i></span> ${published_in}</small>
           </div>
           <div>
           <a id="arrow-icon" onclick="singleDataFetch('${id}')"><i class="fa-solid fa-arrow-right " data-bs-toggle="modal" data-bs-target="#aiModalBox"></i></a>
           </div>
        </div>
    </div>
    `;
        cardContainer.appendChild(div);

        const featureList = document.getElementById(`${id}`);
        element.features.forEach(item => {
            const li = document.createElement('li');
            li.innerText = item;
            featureList.appendChild(li);
        })
    });
    const spinnerSection = document.getElementById('spinner-section');
    spinnerSection.classList.add('d-none');
}

// Fetch single data 
const singleDataFetch = (id) => {
    const URL = `https://openapi.programming-hero.com/api/ai/tool/${id}`
    fetch(URL).then(res => res.json())
        .then(data => displaySingleData(data.data))
}

// Display single data
const displaySingleData = (data) => {
    const { description, pricing, features, id, accuracy } = data;
    // Modal description
    document.getElementById('aiModalTitle').innerText = description;
    // Modal pricing
    const priceContainer = document.getElementById('modal-price-container');
    priceContainer.innerHTML = `
        <div class="col-sm-12 col-md-3 bg-white rounded text-center text-success pricing-text"><strong>
        <p>${(!pricing || pricing[0].price == '0' || pricing[0].price == 'No cost') ? "Free of cost" : pricing[0].price}</p>
        <span>${pricing ? pricing[0].plan : 'Basic'}</span></strong>
        </div>
        <div class="col-sm-12 col-md-3 bg-white rounded text-center text-warning pricing-text"
        id="pricing-middle-col"><strong>
        <p>${(!pricing || pricing[1].price == '0' || pricing[1].price == 'No cost') ? "Free of cost" : pricing[1].price}</p>
        <span>${pricing ? pricing[1].plan : 'Pro'}</span></strong>
        </div>
        <div class="col-sm-12 col-md-3 bg-white rounded text-center text-danger pricing-text"><strong>
        <p>${(!pricing || pricing[2].price == '0' || pricing[2].price == 'No cost') ? "Free of cost" : pricing[2].price}</p>
        <span>${pricing ? pricing[2].plan : 'Enterprise'}</span></strong>
        
        </div>

`;
    // Modal features
    document.getElementById('modal-features-container').innerHTML = `
    <h6><b>Features</b></h6>
    <ol id="${id}2">
    
    </ol>
    `;
    const modalFeatureList = document.getElementById(`${id}2`);
    if (data.features) {

        for (const feature in features) {
            const li = document.createElement('li');
            li.innerText = features[feature].feature_name;
            modalFeatureList.appendChild(li);
        }
    } else {
        modalFeatureList.innerText = "No data found";
    }

    // Modal Integration
    document.getElementById('modal-integration-container').innerHTML = `
    <h6><b>Integrations</b></h6>
    <ol id="${id}1">
    
    </ol>
    `;
    const modalInterationList = document.getElementById(`${id}1`);
    if (data.integrations) {

        data.integrations.forEach(data => {
            const li = document.createElement('li');
            li.innerText = data;
            modalInterationList.appendChild(li);
        })
    } else {
        modalInterationList.innerText = "No data found";
    }

    // Modal card section
    if (data.input_output_examples) {
        output = data.input_output_examples[0].output;
        input = data.input_output_examples[0].input;
    } else {
        input = "Can you give any Example?";
        output = "No! Not Yet! Take a break!";
    }

    document.getElementById('aiCard-right-image').innerHTML = `
    <p class="text-end position-absolute"><span class="badge bg-danger">${accuracy.score ? accuracy.score + '% accuracy' : ""}</span></p>
    <img src="${data.image_link[0]}" class="card-img-top" alt="Ai product image">
        <div class="card-body">
            <h5 class="card-title">${input}</h5>
            <p class="card-text">${output}</p>
        </div>
    `
}

const sortByDate = (a, b) => {
    const dateA = a.published_in;
    const dateB = b.published_in;
    return new Date(dateA).valueOf() - new Date(dateB).valueOf();
}

fetchData(false, 6);
