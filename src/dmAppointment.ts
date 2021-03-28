import { MachineConfig, send, Action, assign, actions} from "xstate";
import "./styles.scss";
import * as React from "react";
import * as ReactDOM from "react-dom";
import { useMachine, asEffect } from "@xstate/react";
import { inspect } from "@xstate/inspect";

const {cancel} = actions

function say(text: string): Action<SDSContext, SDSEvent> {
    return send((_context: SDSContext) => ({ type: "SPEAK", value: text }))
}

function listen(): Action<SDSContext, SDSEvent> {
    return send('LISTEN')
}

function help(prompt: string, name: string): MachineConfig<SDSContext, any, SDSEvent>{
    return ({entry: say(prompt),
             on: {ENDSPEECH: name+".hist" }})
}

function speech(prompt: string): MachineConfig<SDSContext, any, SDSEvent>{
    return ({entry: say(prompt),
             on: {ENDSPEECH: "ask"
            }})
}

function promptAndAsk(prompt: string, prompt_a:string): MachineConfig<SDSContext, any, SDSEvent> {
    return ({
        initial: "prompt",
        states: {
            prompt: {
                entry: say(prompt),
                on: { ENDSPEECH: "ask" }
            },
            hist : {type: "history"},
            maxspeech: {
                ...speech(prompt_a)
            },
            ask: {
                entry: [listen(), send('MAXSPEECH', {delay: 6000})]
            },
        }})
}


const grammar: { [index: string]: { pokemon?: string, place?: string, level?: string } } = {

    //name of example pokemon 
    "Pikachu": { pokemon: "Pikachu" },
    "Bulbasaur": { pokemon: "Bulbasaur" },
    "Charmander": { pokemon: "Charmander" },
    "Squirtle": { pokemon: "Squirtle" },
    "Mew": { pokemon: "Mew" },
    "Mewtwo": { pokemon: "Mewtwo" },
    "Seel": { pokemon: "Seel" },
    "Dewgong": { pokemon: "Dewgong" },
    "Jynx": { pokemon: "Jynx" },
    "Eevee": { pokemon: "Eevee" },
    "Snorlax": { pokemon: "Snorlax" },
    "Slowking": { pokemon: "Slowking" },
    "Butterfree": { pokemon: "Butterfree" },
    "Ninetails": { pokemon: "Ninetails" },
    "Psyduck": { pokemon: "Psyduck" },
    "Kadabra": { pokemon: "Kadabra" },
    "Golem": { pokemon: "Golem" },
    "Seaking": { pokemon: "Seaking" },
    "Mister Mime": { pokemon: "Mister Mime" },








    //region or real life country 
    "Göteborg" : { place: "Göteborg, Sweden" },
    "Stockholm" : { place: "Stockholm, Sweden" },
    "Ilsan" : { place: "Ilsan, South Korea" },
    "Allen" : { place: "Allen, United States" },
    "Cairo" : { place: "Cairo, Egypt" },
    "Seoul" : { place: "Seoul, South Korea" },
    "Addis Ababa" : { place: "Addis Ababa, Ethiopia" },
    "Patras" : { place: "Patras, Greece" },
    "Suzhou" : { place: "Suzhou, China" },
    "Lima" : { place: "Lima, Peru" },
    "Mexico City" : { place: "Mexico City, Mexico" },
    "Bangkok" : { place: "Bangkok, Thailand" },
    "Bucharest" : { place: "Bucharest, Romania" },
    "Dhaka" : { place: "Dhaka, Bangladesh" },
    "Kabul" : { place: "Kabul, Afghanistan" },
    "Kingston" : { place: "Kingston, Jamaica" },

    //in-game region names from pokemon franchise
    "Kanto" : { place: "Kanto Region" },
    "Johto" : { place: "Johto Region" },
    "Hoenn" : { place: "Hoenn Region" },
    "Sinnoh" : { place: "Sinnoh Region" },
    "Unova": { place: "Unova Region" },
    "Kalos": { place: "Kalos Region" },
    "Alola" : { place: "Alola Region"},
    "Galar" : { place: "Galar Region"},

    //routes in region
    // Route 20
    // Route 8 
    // Route 7 
    // Route 13 
    // Route 213 
    // Route 4
    // Route 113
    // Route 36 
     
     
    

	//time 
	"one" : { level: "1" },
    "two" : { level: "2" },
    "three" : { level: "3"},
    "four": { level: "4" },
    "five": { level: "5" },
    "six": { level: "6" },
    "seven": { level: "7" },
    "eight": { level: "8" },
    "nine": { level: "9" },
    "ten": { level: "10" },
    "eleven": { level: "11" },
    "twelve": { level: "12" },
    "thirteen": { level: "13" },
    "fourteen": { level: "14" },
    "fifteen": { level: "15" },
    "sixteen": { level: "16" },
    "seventeen": { level: "17" },
    "eighteen": { level: "18" },
    "nineteen": { level: "19" },
    "twenty": { level: "20" },
    "twenty one": { level: "21" },
    "twenty two": { level: "22" },
    "twenty three": { level: "23" },
    "twenty four": { level: "24" }
}


const grammar2 : { [index: string]: boolean }= { 

                  "yes": true,
                  "Yes": true,
				  "Of course": true,
                  "of course": true, 
                  "okay": true,
                  "Okay": true,
                  "Yup": true,
                  "yup": true,
                  "Ja": true,
                  "ja": true,
                  "No": false,
				  "no" : false,
                  "Nej": false,
                  "nej": false,
				  "No way": false,
				  "no way" : false
}

const grammar3 ={"count": 0}

const help_commands = {"help": "Help", "Help": "Help"}



export const dmMachine: MachineConfig<SDSContext, any, SDSEvent> = ({
    initial: 'init',
    states: {
        init: {
            on: {
                CLICK: 'welcome'
            }
        },
		welcome: {
            initial: "prompt",
            on: {
                RECOGNISED: [{
                    target: "query",
                    cond: (context) => !(context.recResult in help_commands),
                    actions: [assign((context) => { return { option: context.recResult } }),assign((context) => { grammar3["count"]=0}),cancel("maxsp")],
                },

                {target: "welcome_help",
                cond: (context) => context.recResult in help_commands}], 
                

                MAXSPEECH: [{
                    target:".maxspeech",
                    cond: (context) => grammar3["count"] <= 2,
                    actions: assign((context) => { grammar3["count"]=grammar3["count"]+1 } )
                    },
                    {target: "#root.dm.init", 
                    cond: (context) => grammar3["count"] > 2, 
                    actions:assign((context) => { grammar3["count"]=0})}]
            },

            states: {        
                prompt: {
                entry: say("Pokedex online. Select feature."),
                on: { ENDSPEECH: "ask" }
            },

            hist: {type: "history"},

            maxspeech: {
                ...speech("Please respond. What Pokemon have you come across?")
        },  

            ask: {
                entry: [listen(), send('MAXSPEECH', {delay: 6000})]
            }
        }   
    }, 
    
        welcome_help:{
            ...help("This is the Pokedex, a repository of information. Please tell me which Pokemon you encountered.", "welcome")
            
        },

		query: {
            invoke: {
                id: "rasa",
                src: (context, event) => nluRequest(context.option),
                onDone: {
                    target: "menu",
                    actions: [assign((context, event) => { return  {option: event.data.intent.name} }),
                    (context: SDSContext, event: any) => console.log(event.data), cancel("maxsp")]
                    //actions: assign({ intent: (context: SDSContext, event: any) =>{ return event.data }})

                },
                onError: {
                    target: "welcome",
                    actions: [(context, event) => console.log(event.data), cancel("maxsp")]
                }
            }
        },
      
        menu: {
            initial: "prompt",
            on: {
                ENDSPEECH: [
                    //{ target: "todo", cond: (context) => context.option === "todo" },
                    //{ target: "timer", cond: (context) => context.option === "timer" },
                    { target: "pokedex", cond: (context) => context.option === "pokedex" }
                ]
            },

            states: {
                prompt: {
                    entry: send((context) => ({
                        type: "SPEAK",
                        value: `OK. You chose ${context.option}.`
                    })),
        },

                 nomatch: {
                    entry: say("Sorry, please repeat again."),
                    on: { ENDSPEECH: "prompt" }
        } 
            }       
        },

        // todo: {
        //     initial: "prompt",
        //     on: { ENDSPEECH: "init" },
        //     states: {
        //         prompt: {
        //             entry: send((context) => ({
        //                 type: "SPEAK",
        //                 value: `Let"s create a to do item!`
        //             }))
        //         }}
        // },
        
        // timer: {
        //     initial: "prompt",
        //     on: { ENDSPEECH: "init" },
        //     states: {
        //         prompt: {
        //             entry: send((context) => ({
        //                 type: "SPEAK",
        //                 value: `Let"s create a timer!`
        //             }))
        //         }}
        // },
        
        
         pokedex: {
            initial: "prompt",
            on: { ENDSPEECH: "pokemon" },
            states: {
                prompt: {
                    entry: send((context) => ({
                        type: "SPEAK",
                        value: `Let us make a Pokemon entry into the national Pokedex!`
                    }))
                }}
        },

        pokemon: {
            initial: "prompt",
            on: {
                RECOGNISED: [{
                    target: "place",
                    cond: (context) => "pokemon" in (grammar[context.recResult] || {}),
                    actions: [assign((context) => { return { pokemon: grammar[context.recResult].pokemon } }),assign((context) => { grammar3["count"]=0}), cancel("maxsp")],
                    

                },

                { target: ".nomatch" ,
                 cond: (context) => !(context.recResult in help_commands),
                 actions: cancel("maxsp")},

                 {target: "pokemon_help",
                 cond: (context) => context.recResult in help_commands}],
                 
                 MAXSPEECH: [{target:".maxspeech",
                 cond: (context) => grammar3["count"] <= 2,
                actions: assign((context) => { grammar3["count"]=grammar3["count"]+1 } )
                },{target: "#root.dm.init", 
                cond: (context) => grammar3["count"] > 2, 
                actions:assign((context) => { grammar3["count"]=0})}] 
            },

            states: {
                prompt: {
                    entry: say("Which Pokemon have you seen?"),
                    on: { ENDSPEECH: "ask" }
                },
                hist: {type: "history"},
                ask: {
                    entry: [listen(), send('MAXSPEECH', {delay: 6000, id: "maxsp"})]
                },
                maxspeech: {
                    ...speech("Please respond, what is the Pokemon you have seen?")
                },
                nomatch: {
                    entry: say("Sorry I don't know that Pokemon."),
                    on: { ENDSPEECH:  "prompt" }
                
                }
             }
        },

        pokemon_help:{
            ...help("Please tell me the name of the pokemon you want to input data for.","pokemon")
        },

        place: {
            initial: "prompt",
            on: {
	            RECOGNISED: [{
	                cond: (context) => "day" in (grammar[context.recResult] || {}),
		             actions: [assign((context) => { return { place: grammar[context.recResult].place } }),assign((context) => { grammar3["count"]=0}),cancel("maxsp")],
		            target: "shiny"

		        },	
		        { target: ".nomatch" ,
                cond: (context) => !(context.recResult in help_commands),
                actions: cancel("maxsp")},
                {target: "place_help",
                cond: (context) => context.recResult in help_commands}],
                MAXSPEECH: [{target:".maxspeech",
                cond: (context) => grammar3["count"] <= 2,
                actions: assign((context) => { grammar3["count"]=grammar3["count"]+1 } )
                },{target: "#root.dm.init", 
                cond: (context) => grammar3["count"] > 2, 
                actions:assign((context) => { grammar3["count"]=0})}] 
	        },

            states: {
                prompt: {
                    entry: send((context) => ({
                        type: "SPEAK",
                        value: `You have come across a ${context.pokemon}. What region have you made this encounter in?`
                    })),
		            on: { ENDSPEECH: "ask" }
                },
                hist: {type: "history"},
		        ask: {
		            entry: [listen(), send('MAXSPEECH', {delay: 6000, id: "maxsp"})]
	            },
                maxspeech: {
                 ...speech("Please respond. Which region did you make your encounter in?")
              },
		        nomatch: {
		            entry: say("Sorry, I don't know which region or place you are talking about"),
		            on: { ENDSPEECH: "prompt" }
	            }	     
            }
        },

        place_help:{
            ...help("Please tell me where your encounter was.","place")
        },
        
	    shiny: {
		        initial: "prompt",
		        on: {
	                RECOGNISED: [{
			            cond: (context) => grammar2[context.recResult] === true,
                        target: "timefixed",
                        actions: [assign((context) => { grammar3["count"]=0}),cancel("maxsp")]},
						{
						cond: (context) => grammar2[context.recResult] === false,
						target: "settime",
                        actions: [assign((context) => { grammar3["count"]=0}),cancel("maxsp")]

		            },

	                { target: ".nomatch",
                    cond: (context) => !(context.recResult in help_commands),
                    actions: cancel("maxsp")},
                    {target: "shiny_help",
                    cond: (context) => context.recResult in help_commands}],
                    
                    MAXSPEECH: [{target:".maxspeech",
                    cond: (context) => grammar3["count"] <= 2,
                    actions: assign((context) => { grammar3["count"]=grammar3["count"]+1 } )
                    },
                    {target: "#root.dm.init", 
                    cond: (context) => grammar3["count"] > 2, 
                    actions:assign((context) => { grammar3["count"]=0})}] 
		        },

		        states: {
		            prompt: {
			            entry: send((context) => ({
			                type: "SPEAK",
						    value: `Interesting. The encounter was in ${context.place}. Tell me, was this a shiny Pokemon?`
			            })),
			            on: { ENDSPEECH: "ask" }
		            },

                    hist: {type: "history"},
		            
                    ask: {
		                entry: [listen(), send('MAXSPEECH', {delay: 6000, id: "maxsp"})]
		            },
                    
                    maxspeech: {
                      ...speech("Please respond.")
                    },
		            
                    nomatch: {
			            entry: say("Please answer the question."),
		                on: { ENDSPEECH: "prompt" }
		            }
		        }	     
            },
            
            shiny_help:{
                ...help("Please answer the question with yes or no.","shiny")
            },
            
            timefixed: {
		           initial: "prompt",
	               on: {
		               RECOGNISED: [{ 
			               cond: (context) => grammar2[context.recResult] === true,
			               target: "Finished",
                           actions: [assign((context) => { grammar3["count"]=0}),cancel("maxsp")]},

						   {
						   cond: (context) => grammar2[context.recResult] === false,
                           target: "pokemon",
                           actions: [assign((context) => { grammar3["count"]=0}),cancel("maxsp")]
						   
		                },

		                { target: ".nomatch",
                        cond: (context) => !(context.recResult in help_commands),
                        actions: cancel("maxsp")},
                        
                        {target: "timefixed_help",
                        cond: (context) => context.recResult in help_commands}],
                        MAXSPEECH: [{target:".maxspeech",
                        cond: (context) => grammar3["count"] <= 2,
                        actions: assign((context) => { grammar3["count"]=grammar3["count"]+1 } )
                        },
                        {target: "#root.dm.init", 
                        cond: (context) => grammar3["count"] > 2, 
                        actions:assign((context) => { grammar3["count"]=0})}]  
		            },
		            states: {
		                prompt: {
			                entry: send((context) => ({
			                    type: "SPEAK",
								value: `Superb. Do you want me to confirm an entry with an encounter with a shiny ${context.pokemon} in ${context.place}?`
                            })),
                            on: { ENDSPEECH: "ask" }
		                },

                        hist: {type: "history"},
		                
                        ask: {
			                entry: [listen(), send('MAXSPEECH', {delay: 6000, id: "maxsp"})]
		                },

                        maxspeech: {
                             ...speech("Please, respond. Confirm the Pokedex entry.")},
		                
                        nomatch: {
			                entry: say("Please, repeat it again."),
			                on: { ENDSPEECH: "prompt" }
		                }
                    }
	            },

                timefixed_help:{
                    ...help("Confirm the Pokedex entry, please.","timefixed")
                },

				settime: {
					initial: "prompt",
					on: {
						RECOGNISED: [{
							cond: (context) => "time" in (grammar[context.recResult] || {}),
							actions: [assign((context) => { return { level: grammar[context.recResult].time } }),assign((context) => { grammar3["count"]=0})],
							target: "confirm_time"
						},

						{ target: ".nomatch" ,
                        cond: (context) => !(context.recResult in help_commands),
                        actions: cancel("maxsp")},
                        {target: "settime_help",
                        cond: (context) => context.recResult in help_commands}],

                        MAXSPEECH: [{target:".maxspeech",
                        cond: (context) => grammar3["count"] <= 2,
                        actions: assign((context) => { grammar3["count"]=grammar3["count"]+1 } )
                        },{target: "#root.dm.init", 
                        cond: (context) => grammar3["count"] > 2, 
                        actions:assign((context) => { grammar3["count"]=0})}]  
					},
					states: {
						prompt: { entry: say("What level is the Pokemon}?"),
						on: { ENDSPEECH: "ask" }
					},
                    hist: {type: "history"},
					ask: {
						entry: [listen(), send('MAXSPEECH', {delay: 6000, id: "maxsp"})]
				},
                maxspeech: {
                  ...speech("Please respond. What level was the Pokemon you encountered?")
                },
				nomatch: {
					entry: say("Please repeat it again"),
					on: { ENDSPEECH: "prompt" }
				}
			}
		},
        settime_help:{
            ...help("Please, tell me what level the Pokemon was.","settime")
        },
        
		confirm_time: {
			initial: "prompt",
			on: {
				RECOGNISED: [{ 
					cond: (context) => grammar2[context.recResult] === true,
					target: "Finished",
                    actions: assign((context) => { grammar3["count"]=0})},
					{
					cond: (context) => grammar2[context.recResult] === false,
					target: "pokemon",
                    actions: [assign((context) => { grammar3["count"]=0}),cancel("maxsp")]

				 },
				 { target: ".nomatch",
                 cond: (context) => !(context.recResult in help_commands),
                 actions: cancel("maxsp")},
                 {target: "confirm_time_help",
                 cond: (context) => context.recResult in help_commands}],
                
                 MAXSPEECH: [{target:".maxspeech",
                 cond: (context) => grammar3["count"] <= 2,
                actions: assign((context) => { grammar3["count"]=grammar3["count"]+1 } )
                },
            
                {target: "#root.dm.init", 
                cond: (context) => grammar3["count"] > 2, 
                actions:assign((context) => { grammar3["count"]=0})}] 
			 },

			 states: {
				 prompt: {
					 entry: send((context) => ({
						 type: "SPEAK",
						 value: `Excellent. Do you want me to confirm an entry with an encounter with a level ${context.level} ${context.pokemon} in ${context.place}?`
					 })),
					 on: { ENDSPEECH: "ask" }
				 },

                 hist: {type: "history"},
				 
                 ask: {
					 entry: [listen(), send('MAXSPEECH', {delay: 6000, id: "maxsp"})]
				 },

                maxspeech: {
                 ...speech("Please, confirm the Pokedex entry.")
                },    
                    
				 nomatch: {
					 entry: say("Please, repeat it again."),
					 on: { ENDSPEECH: "prompt" }
				 }
			 }
		},
        confirm_time_help:{
            ...help("Please, confirm the Pokedex entry.","confirm_time")
        },
        
        Finished: {
		                 initial: "prompt",
		                 on: { ENDSPEECH: "init" },
		                 states: {
			                 prompt: { entry: say("Congratulations. Your Pokedex has been updated with your encounter and is one step closer to being completed!")
		                    },
	                    }
	                }	    
                }
            })


			/* RASA API
 *  */
const proxyurl = "https://cors-anywhere.herokuapp.com/";
const rasaurl = "https://appointment--app.herokuapp.com/model/parse"
const nluRequest = (text: string) =>
    fetch(new Request(proxyurl + rasaurl, {
        method: "POST",
        headers: { "Origin": "http://localhost:3000/react-xstate-colourchanger" }, // only required with proxy
        body: `{"text": "${text}"}`
    }))
        .then(data => data.json());
