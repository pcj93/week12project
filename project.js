class Pokmeon {
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
        return $.get(this.url);
    }

    static getPokemon(id){
        return $.post(this.url + `/${id}`);
    }

    static createPokemon(pokemon){
        return $.post(this.url, pokemon);
    }

    static updatePokemon(pokemon){
        return $.ajax({
            url: this.url + `/${pokemon._id}`,
            dataType:'json',
            data: JSON.stringify(pokemon),
            contentType:'application/json',
            type: 'PUT'
        });
    }

    static deletePokemon(id) {
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
        PokemonService.createPokemon(new Pokmeon(name))
        .then(() => {
            return PokemonService.getAllPokemons();
        })
        .then((pokemons) => this.render(pokemons));
    }

    static deletePokemon(id) {
        PokemonService.deletePokemon(id)
        .then(() => {
            return PokemonService.getAllPokemons();
        })
        .then((pokemons) => this.render(pokemons));
    }

    static addPokemon(id) {
        for (let pokemon of this.pokemons) {
            if(pokemon._id == id){
                pokemon.teams.push(new Team($(`#${pokemon._id}-team-name`).val(), $(`#${pokemon._id}-team-move`).val()));
                PokemonService.updatePokemon(pokemon)
                .then(() => {
                    return PokemonService.getAllPokemons();
                })
                .then((pokemons) => this.render(pokemons));
            }
        }
    }

    static deleteTeam(pokemonId, teamId) {
        for (let pokemon of this.pokemons) {
            if (pokemon._id == pokemonId) {
                for (let team of pokemon.teams) {
                    if (team._id == teamId){
                        pokemon.teams.splice(pokemon.teams.indexOf(move), 1);
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
                `<div id="${pokemon._id}" class="card">
                <div class= "card-header">
                <h2>${pokemon.name}</h2>
                <button class="btn btn-danger" onclick="DOMManager.deletePokemon('${pokemon._id}')">Delete</button>
                </div>
                <div class="card-body">
                    <div class="card">
                    <div class="row">
                    <div class="col-sm">
                    <input type="text" id="${pokemon._id}team-name" class="form-control" placeholder="Pokemon Name"
                    </div>
                    <div class="col-sm">
                    <input type="text" id="${pokemon._id}team-move" class="form-control" placeholder="Pokemon Moves"
                    </div>
                    </div>
                    <button id="${pokemon._id}-new-team" onclick="DOMManager.addPokemon('${pokemon._id}')" class="btn btn-primary form-control">Add</button>
                    </div>
                </div>
                </div><br>`

            );
            for(let team of pokemon.teams){
                $(`#${pokemon._id}`).find('.card-body').append(
                    `<p>
                    <span id="name-${team._id}"><strong>Name: </strong> ${team.name}</span>
                    <span id="move-${team._id}"><strong>Move: </strong> ${team.move}</span>
                    <button class="btn btn-danger" onclick="DOMManager.deletePokemon('${pokemon._id}', '${team._id}')">Delete Pokemon</button>`
                );
            }
        }
    }
} 


$(`#create-new-pokemon`).on("click",() => {
    DOMManager.createPokemon($(`#new-pokmemon-name`).val());
    $(`#new-pokmemon-name`).val('');
})

DOMManager.getAllPokemon();