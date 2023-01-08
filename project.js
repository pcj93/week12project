class Pokemon {
    constructor(name){
        this.name = name;
        this.teams = []
    }

    addPokemon(name, move){
        this.teams.push(new Team (name, move));
    }
}

class Team {
    constructor(name, move){
        this.name = name;
        this.move = move;
    }
}

class PokemonService{
    static url = "https://63b376615901da0ab380340f.mockapi.io/PokemonList/Pokemon";

    static getAllPokemons(){
        
        return $.get(this.url, (data) =>{
            console.log(data)
        })
    }

    static getPokemon(id){
        return $.post(this.url + `/${id}`);
    }

    static createPokemon(pokemon){
        return $.post(this.url, pokemon);
    }

    static updatePokemon(pokemon){
        return $.ajax({
            url: this.url + `/${pokemon.id}`,
            dataType:'json',
            data: JSON.stringify(pokemon),
            contentType:'application/json',
            type: 'PUT'
        });
    }

    static deleteTeam(id) {
        return $.ajax ({
           url: this.url + `/${id}`,
           type:'DELETE' 
        });
    }
}

class DOMManager{
    static pokemons;

    static getAllPokemon(){
        PokemonService.getAllPokemons().then(pokemons => this.render(pokemons));
    }

    static createPokemon(name){
        PokemonService.createPokemon(new Pokemon(name))
        .then(() => {
            return PokemonService.getAllPokemons();
        })
        .then((pokemons) => this.render(pokemons));
    }

    static deleteTeam(id) {
        PokemonService.deleteTeam(id)
        .then(() => {
            return PokemonService.getAllPokemons();
        })
        .then((pokemons) => this.render(pokemons));
    }

    static addPokemon(id) {
        for (let pokemon of this.pokemons) {
            if(pokemon.id == id){
                pokemon.teams.push(new Team($(`#${pokemon.id}-team-name`).val(), $(`#${pokemon.id}-team-move`).val()));
                PokemonService.updatePokemon(pokemon)
                .then(() => {
                    return PokemonService.getAllPokemons();
                })
                .then((pokemons) => this.render(pokemons));
            }
        }
    }

    static deletePokemon(pokemonId, teamId) {
        for (let pokemon of this.pokemons) {
            if (pokemon.id == pokemonId) {
                for (let team of pokemon.teams) {
                    if (team.id == teamId){
                        pokemon.teams.splice(pokemon.teams.indexOf(team), 1);
                        PokemonService.updatePokemon(pokemon)
                        .then(() => {
                            return PokemonService.getAllPokemons();
                        })
                        .then((pokemons) => this.render(pokemons));
                    }
                }
            }
        }
    }
    

    static render(pokemons){
        this.pokemons = pokemons;
        $('#app').empty();
        for (let pokemon of pokemons){
            $('#app').prepend(
                `<div id="${pokemon.id}" class="card">
                <div class= "card-header">
                <h2>${pokemon.name}</h2>
                <button class="btn btn-danger" onclick="DOMManager.deleteTeam('${pokemon.id}')">Delete Team</button>
                </div>
                <div class="card-body">
                    <div class="card">
                    <div class="row">
                    <div class="col-sm">
                    <input type="text" id="${pokemon.id}-team-name" class="form-control" placeholder="Pokemon Name"
                    </div>
                    <div class="col-sm">
                    <input type="text" id="${pokemon.id}-team-move" class="form-control" placeholder="Pokemon Moves"
                    </div>
                    </div>
                    <button id="${pokemon.id}create-new-pokemon" onclick="DOMManager.addPokemon('${pokemon.id}')" class="btn btn-primary form-control">Add</button>
                    </div>
                </div>
                </div><br>`

            );
            for (let team of pokemon.teams){
                $(`#${pokemon.id}`).find('.card-body').append(
                    `<p>
                    <span id="name-${team.id}"><strong>Name: </strong> ${team.name}</span>
                    <span id="move-${team.id}"><strong>Move: </strong> ${team.move}</span>
                    <button class="btn btn-danger" onclick="DOMManager.deletePokemon(${pokemon.id}, ${team.id})">Delete Pokemon</button></p>`
                );
            }
        }
    }
} 


$(`#create-new-pokemon`).on("click",() => {
    DOMManager.createPokemon($(`#new-pokemon-name`).val());
    $(`#new-pokemon-name`).val('');
})

DOMManager.getAllPokemon();