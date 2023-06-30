const playerContainer = document.getElementById('all-players-container');
const newPlayerFormContainer = document.getElementById('new-player-form');

// Add your cohort name to the cohortName variable below, replacing the 'COHORT-NAME' placeholder
const cohortName = '2302-acc-pt-web-pt-e';
// Use the APIURL variable for fetch requests
const APIURL = `https://fsa-puppy-bowl.herokuapp.com/api/${cohortName}/players`;

/**
 * It fetches all players from the API and returns them
 * @returns An array of objects.
 */
const fetchAllPlayers = async () => {
    try {  
        const data = await fetch(APIURL)
        const playerdata = await data.json()
        
        return playerdata.data.players
    } catch (err) {
        console.error('Uh oh, trouble fetching players!', err);
    }
};

const fetchSinglePlayer = async (playerId) => {
    try {
        const singleResponse = await fetch(`${APIURL}/${playerId}`)
        const player = await singleResponse.json()
        console.log(player)
        return player
    } catch (err) {
        console.error(`Oh no, trouble fetching player #${playerId}!`, err);
    }
};

const addNewPlayer = async (enteredName,enteredBreed) => {
    try {
        const newPlayer = await fetch(`${APIURL}`,
            {
                method: 'POST',
                headers: {
                    'Content-Type':'application/json',
                },
                body: JSON.stringify({
                    name: enteredName,
                    breed: enteredBreed
                })
            })
        const player = await newPlayer.json()
        return player
    } catch (err) {
        console.error('Oops, something went wrong with adding that player!', err);
    }
};

const removePlayer = async (playerId) => {
    try {
        await fetch(`${APIURL}/${playerId}`, {
            method: 'DELETE',
            headers: {
                'Content-Type':'application/json'
            }
        }).then(res=>res.json())
    } catch (err) {
        console.error(
            `Whoops, trouble removing player #${playerId} from the roster!`,
            err
        );
    }
};

/**
 * It takes an array of player objects, loops through them, and creates a string of HTML for each
 * player, then adds that string to a larger string of HTML that represents all the players. 
 * 
 * Then it takes that larger string of HTML and adds it to the DOM. 
 * 
 * It also adds event listeners to the buttons in each player card. 
 * 
 * The event listeners are for the "See details" and "Remove from roster" buttons. 
 * 
 * The "See details" button calls the `fetchSinglePlayer` function, which makes a fetch request to the
 * API to get the details for a single player. 
 * 
 * The "Remove from roster" button calls the `removePlayer` function, which makes a fetch request to
 * the API to remove a player from the roster. 
 * 
 * The `fetchSinglePlayer` and `removePlayer` functions are defined in the
 * @param playerList - an array of player objects
 * @returns the playerContainerHTML variable.
 */



function renderAllPlayers(playerList) {
  const playerContainerHTML = document.getElementById('all-players-container')
    
  
    
    playerContainerHTML.innerHTML = playerList.map(player => {
      
        // add id to container
    let playerHTML = `
      <div class="player-card" id="card-${player.id}">
        <h3>${player.name}</h3>
        <p>Breed: ${player.breed}</p>
        <p>Status: ${player.status}</p>
        <img src="${player.imageUrl}" alt="${player.name}" />
        <button class="details-button" data-player-id="${player.id}">See details</button>
        <button class="remove-button" data-player-id="${player.id}">Remove from roster</button>
      </div>
    `
    
        return playerHTML

    }).join("")
    
  
  
//   const playerContainer = document.getElementById('playerContainer')
//   playerContainer.innerHTML =playerContainerHTML 
  
  
  const detailsButtons = document.querySelectorAll('.details-button')
  detailsButtons.forEach(button => {
    button.addEventListener('click', () => {
      const playerId = button.getAttribute('data-player-id')
      fetchSinglePlayer(playerId)
    });
  });
  

    
    const removeButtons = document.querySelectorAll('.remove-button');
    removeButtons.forEach((button) => {
        button.addEventListener('click', async () => {
        const playerId = button.getAttribute('data-player-id');
        await removePlayer(playerId);
        const playerCard = document.getElementById(`card-${playerId}`);
        playerCard.remove();
        });
    });
  
  return playerContainerHTML
}









/**
 * It renders a form to the DOM, and when the form is submitted, it adds a new player to the database,
 * fetches all players from the database, and renders them to the DOM.
 */


const renderNewPlayerForm = () => {
  try {
    const newPlayerForm = document.getElementById('newPlayer')
    const submitButton = document.getElementById('submit-button')

    submitButton.addEventListener('click', async (event) => {
      event.preventDefault()

      const nameInput = document.getElementById('name')
      const breedInput = document.getElementById('breed')
      const enteredName = nameInput.value
      const enteredBreed = breedInput.value

      await addNewPlayer(enteredName, enteredBreed)

      nameInput.value = ''
      breedInput.value = ''

      const players = await fetchAllPlayers()
      renderAllPlayers(players)
    })
  } catch (err) {
    console.error('Uh oh, trouble rendering the new player form!', err)
  }
};



const init = async () => {
  try {
      const players = await fetchAllPlayers()
      renderAllPlayers(players)
      renderNewPlayerForm()
    
        
  } catch (err) {
    console.error('Uh oh, trouble initializing the app!', err)
  }
}

init()


