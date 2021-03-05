import { MachineConfig, Machine, send, Action, assign } from "xstate";
import "./styles.scss";


function say(text: string): Action<SDSContext, SDSEvent> {
    return send((_context: SDSContext) => ({ type: "SPEAK", value: text }))
}

function listen(): Action<SDSContext, SDSEvent> {
    return send("LISTEN")
}

const grammar: { [index: string]: { person?: string, day?: string, time?: string } 
} = {
    // Here are some common names in English that I found are easier for the robot to understand.
    "John": { person: "John Appleseed" },
    "Jack": { person: "Jack Orangeseed" },
    "David": { person: "David Grapeseed" },
    "Robert": { person: "Robert Watermelonseed" },
    "Jennifer": { person: "Jennifer Bananaseed" },
    "Jessica": { person: "Jessica Pineappleseed" },

    "john": { person: "john appleseed" },
    "jack": { person: "jack orangeseed" },
    "david": { person: "david grapeseed" },
    "robert": { person: "robert watermelonseed" },
    "jennifer": { person: "jennifer bananaseed" },
    "jessica": { person: "jessica pineappleseed" },

    // Here are names of friends I tried at first, but because they're non-English it was incredibly hard to move forward with the robot so I mad the previously mentioned English names above.
    "Zhe": { person: "Zhe Han" },
    "Siyi": { person: "Siyi Gu" },
    "Jae Eun": { person: "Jae Eun Hong" },
    "Oreen": { person: "Oreen Yousuf" },
    "Angeliki": { person: "Angeliki Zagoura" },
    "Flor": { person: "Flor Ortiz" },
    "Emma": { person: "Emma Wallerö"},

    "zhe": { person: "zhe han" },
    "siyi": { person: "siyi gu" },
    "jae eun": { person: "jae eun hong" },
    "oreen": { person: "oreen yousuf" },
    "angeliki": { person: "angeliki zagoura" },
    "flor": { person: "flor ortiz" },
    "emma": { person: "emma wallerö" },

    //Days of the week with alternating potential utterances ('on')
    "Monday": { day: "Monday" },
    "on Monday": { day: "Monday" },
    "Tuesday": { day: "Tuesday" },
    "on Tuesday": { day: "Tuesday" },
    "Wednesday": { day: "Wednesday" },
    "on Wednesday": { day: "Wednesday" },
    "Thursday": { day: "Thursday" },
    "on Thursday": { day: "Thursday" },
    "Friday": { day: "Friday" },
    "on Friday": { day: "Friday" },
    "Saturday": { day: "Saturday" },
    "on Saturday": { day: "Saturday" },
    "Sunday": { day: "Sunday" },
    "on Sunday": { day: "Sunday" },

    //times with different utterances and spellings/numberings to capture all ways the robot could interpret it
    "at one": { time: "01:00" },
    "at two": { time: "02:00" },
    "at three": { time: "03:00" },
    "at four": { time: "04:00" },
    "at five": { time: "05:00" },
    "at six": { time: "06:00" },
    "at seven": { time: "07:00" },
    "at eight": { time: "08:00" },
    "at nine": { time: "09:00" },
    "at ten": { time: "10:00" },
    "at eleven": { time: "11:00" },
    "at twelve": { time: "12:00" },
    "at thirteen": { time: "13:00" },
    "at fourteen": { time: "14:00" },
    "at fifteen": { time: "15:00" },
    "at sixteen": { time: "16:00" },
    "at seventeen": { time: "17:00" },
    "at eighteen": { time: "18:00" },
    "at nineteen": { time: "19:00" },
    "at twenty": { time: "20:00" },
    "at twenty one": { time: "21:00" },
    "at twenty two": { time: "22:00" },
    "at twenty three": { time: "23:00" },
    "at twenty four": { time: "00:00" },

    "one": { time: "01:00" },
    "two": { time: "02:00" },
    "three": { time: "03:00" },
    "four": { time: "04:00" },
    "five": { time: "05:00" },
    "six": { time: "06:00" },
    "seven": { time: "07:00" },
    "eight": { time: "08:00" },
    "nine": { time: "09:00" },
    "ten": { time: "10:00" },
    "eleven": { time: "11:00" },
    "twelve": { time: "12:00" },
    "thirteen": { time: "13:00" },
    "fourteen": { time: "14:00" },
    "fifteen": { time: "15:00" },
    "sixteen": { time: "16:00" },
    "seventeen": { time: "17:00" },
    "eighteen": { time: "18:00" },
    "nineteen": { time: "19:00" },
    "twenty": { time: "20:00" },
    "twenty one": { time: "21:00" },
    "twenty two": { time: "22:00" },
    "twenty three": { time: "23:00" },
    "twenty four": { time: "00:00" },

    "at 1": { time: "01:00" },
    "at 2": { time: "02:00" },
    "at 3": { time: "03:00" },
    "at 4": { time: "04:00" },
    "at 5": { time: "05:00" },
    "at 6": { time: "06:00" },
    "at 7": { time: "07:00" },
    "at 8": { time: "08:00" },
    "at 9": { time: "09:00" },
    "at 10": { time: "10:00" },
    "at 11": { time: "11:00" },
    "at 12": { time: "12:00" },
    "at 13": { time: "13:00" },
    "at 14": { time: "14:00" },
    "at 15": { time: "15:00" },
    "at 16": { time: "16:00" },
    "at 17": { time: "17:00" },
    "at 18": { time: "18:00" },
    "at 19": { time: "19:00" },
    "at 20": { time: "20:00" },
    "at 21": { time: "21:00" },
    "at 22": { time: "22:00" },
    "at 23": { time: "23:00" },
    "at 24": { time: "00:00" },

    "1": { time: "01:00" },
    "2": { time: "02:00" },
    "3": { time: "03:00" },
    "4": { time: "04:00" },
    "5": { time: "05:00" },
    "6": { time: "06:00" },
    "7": { time: "07:00" },
    "8": { time: "08:00" },
    "9": { time: "09:00" },
    "10": { time: "10:00" },
    "11": { time: "11:00" },
    "12": { time: "12:00" },
    "13": { time: "13:00" },
    "14": { time: "14:00" },
    "15": { time: "15:00" },
    "16": { time: "16:00" },
    "17": { time: "17:00" },
    "18": { time: "18:00" },
    "19": { time: "19:00" },
    "20": { time: "20:00" },
    "21": { time: "21:00" },
    "22": { time: "22:00" },
    "23": { time: "23:00" },
    "24": { time: "00:00" }
}

//second grammar for trues and falses
const grammar2 : { [index: string]: boolean } = 
    {"yes": true,
    "Yes": true,
    "yes of course": true,
    "Yes of course": true,
    "sure": true,
    "Sure": true,
    "absolutely": true,
    "Absolutely": true,
    "perfect": true,
    "Perfect": true,
    "no": false,
    "No": false,
    "no way": false,
    "No way": false
}


/*function promptAndAsk(prompt: string): MachineConfig<SDSContext, any, SDSEvent> {
    return ({
        initial: "prompt",
        states: {
            prompt: {
                entry: say(prompt),
                on: { ENDSPEECH: "ask" }
            },
            ask: {
                entry: send("LISTEN")
            },
        }})
}


export const dmMachine: MachineConfig<SDSContext, any, SDSEvent> = ({
   
    initial: "init",
    states: {
        init: {
            on: {
                CLICK: "welcome"
            }            
        },        

        welcome: {
            on: {
                RECOGNISED: {
                    target: "query",
                    actions: assign((context) => { return { option: context.recResult } }),
                }    
            },
                    ...promptAndAsk("What would you like to do? Your options are appointment, to do item or timer")
        },


        query: {
            invoke: {
                id: "rasa",
                src: (context, event) => nluRequest(context.option),
                onDone: {
                    target: "menu",
                    actions: [assign((context, event) => { return  {option: event.data.intent.name} }),
                    (context: SDSContext, event: any) => console.log(event.data)]
                    //actions: assign({ intent: (context: SDSContext, event: any) =>{ return event.data }})

                },
                onError: {
                    target: "welcome",
                    actions: (context, event) => console.log(event.data)
                }
            }
        },

        menu: {
            initial: "prompt",
            on: {
                ENDSPEECH: [
                    { target: "todo", cond: (context) => context.option === "todo" },
                    { target: "timer", cond: (context) => context.option === "timer" },
                    { target: "appointment", cond: (context) => context.option === "appointment" }
                ]
            },
            states: {
                prompt: {
                    entry: send((context) => ({
                        type: "SPEAK",
                        value: `OK. I understand.`
                    })),
        }, 
            }       
        },


        todo: {
            initial: "prompt",
            on: { ENDSPEECH: "init" },
            states: {
                prompt: {
                    entry: send((context) => ({
                        type: "SPEAK",
                        value: `Let"s create a to do item`
                    }))
                }}
        },
        
        timer: {
            initial: "prompt",
            on: { ENDSPEECH: "init" },
            states: {
                prompt: {
                    entry: send((context) => ({
                        type: "SPEAK",
                        value: `Let"s create a timer`
                    }))
                }}
        },
        
        
        appointment: {
            initial: "prompt",
            on: { ENDSPEECH: "who" },
            states: {
                prompt: {
                    entry: send((context) => ({
                        type: "SPEAK",
                        value: `Let"s create an appointment`
                    }))
                }}
        },
        who: {
            initial: "prompt",
            on: {
                RECOGNISED: [{
					cond: (context) => "person" in (grammar[context.recResult] || {}),
                    actions: assign((context) => { return { person: grammar[context.recResult].person } }),
                    target: "day"

                },
                { target: ".nomatch" }]
            },
            states: {
                prompt: {
                    entry: say("Who are you meeting with?"),
                    on: { ENDSPEECH: "ask" }
                },
                ask: {
                    entry: listen()
                },
                nomatch: {
                    entry: say("Sorry I do not know them"),
                    on: { ENDSPEECH: "prompt" }
                }
            }
        },
        day: {
            initial: "prompt",
            on: {
                RECOGNISED: [{
                    cond: (context) => "day" in (grammar[context.recResult] || {}),
                    actions: assign((context) => { return { day: grammar[context.recResult].day } }),
                    target: "wholeday"
                },
                { target: ".nomatch" }]
            },
            states: {
                prompt: {
                    entry: send((context) => ({
                        type: "SPEAK",
                        value: `OK. ${context.person}. On which day is your meeting?`,
                    })),
                    on: { ENDSPEECH: "ask" }
                },
                ask: {
                    entry: listen()
                },
                nomatch: {
                    entry: say("Sorry I do not understand"),
                    on: { ENDSPEECH: "prompt" }
                }
            }
        },
        wholeday: {
            initial: "prompt",
            on: {
                RECOGNISED: [{cond: (context) => (grammar2[context.recResult] === false),
                    target: "time"
                },
		{cond: (context) => (grammar2[context.recResult] === true),
		target: "confirm_meeting_whole_day"
		},
                { target: ".nomatch" }]
            },
            states: {
                prompt: {
                    entry: send((context) => ({
                        type: "SPEAK",
                        value: `OK. ${context.person} on ${context.day}. Will it take the whole day?`
                    })),
		    on: { ENDSPEECH: "ask" }
                },
		ask: {
		     entry: listen()
            },
	    nomatch: {
	    	entry: say("Sorry I do not understand"),
		on: { ENDSPEECH: "prompt" }
	            }
                }
	},
        time: {
            initial: "prompt",
            on: {
                RECOGNISED: [{
                    cond: (context) => "time" in (grammar[context.recResult] || {}),
                    actions: assign((context) => { return { time: grammar[context.recResult].time } }),
                    target: "confirm_time"

                },
                { target: ".nomatch" }]
            },
            states: {
                prompt: {
                    entry: send((context) => ({
                        type: "SPEAK",
                        value: `OK. ${context.day}. What time is your meeting?`,
                    
                    })),
            on: { ENDSPEECH: "ask" }
                },
        ask: {
            entry: listen()
                },
        nomatch: {
            entry: say("Sorry I do not know that"),
        on: { ENDSPEECH: "prompt" }
                }
                }
        },
        confirm_meeting_whole_day: {
            initial: "prompt",
            on: {
                RECOGNISED: [{cond: (context) => (grammar2[context.recResult] === false),
                    target: "init"
                },
		{cond: (context) => (grammar2[context.recResult] === true),
		target: "confirmed"
		},
                { target: ".nomatch" }]
            },

            states: {
                prompt: {
                    entry: send((context) => ({
                        type: "SPEAK",
                        value: `Do you want to create an appointment with ${context.person} on ${context.day} for the whole day?`
                    })),
		    on: { ENDSPEECH: "ask" }
                },
		ask: {
		     entry: listen()
            },
	    nomatch: {
	    	entry: say("Sorry I do not understand"),
		on: { ENDSPEECH: "prompt" }
	           }
                }

	},
    confirm_time: {
        initial: "prompt",
        on:  {
            RECOGNISED: [{cond: (context) => (grammar2[context.recResult] === false),
                target: "who"
            },
    {cond: (context) => (grammar2[context.recResult] === true),
    target: "confirmed"
    },
            { target: ".nomatch" }]
        },
        states: {
            prompt: {
               entry: send((context) => ({
                    type: "SPEAK",
                    value: `Do you want to create an appointment with ${context.person} on ${context.day} at ${context.time}?`
                })),
        on: { ENDSPEECH: "ask" }
            },
    ask: {
         entry: listen()
        },
    nomatch: {
        entry: say("Sorry I do not understand"),
    on: { ENDSPEECH: "prompt" }
           }
            },
        },
    confirmed: {
        initial: "prompt",
        on: { ENDSPEECH: "init" },
        states: {
            prompt: {
                entry: send((context) => ({
                    type: "SPEAK",
                    value: `Your appointment has been created!`
                }))
            },
    }
    }
    }})
*/

function promptAsk(prompt: string): MachineConfig<SDSContext, any, SDSEvent> {
    return ({
        initial: 'prompt',
        states: {
            prompt: {
                entry: say(prompt),
                on: { ENDSPEECH: 'ask' }
            },
            ask: {
                entry: send('LISTEN')
            },
        }})
}


export const dmMachine: MachineConfig<SDSContext, any, SDSEvent> = 

({
    initial: 'init',
    states: 
    
    {
        init:{
            on: {
                CLICK: 'welcome'
                }
             },

        welcome: 
        {
            on: {
                RECOGNISED: {
                    target: "query",
                    actions: assign((context) => { return { option: context.recResult } }),
                }    
            },
                    ...promptAsk("What would you like to do?")
        },

        query: 
        {
            invoke: {
            
            id: 'rasa',
            src: (context, event) => nluRequest(context.option),
            onDone: {
                target: 'menu',
                actions: [assign((context, event) => { return  {option: event.data.intent.name} }),
                (context: SDSContext, event: any) => console.log(event.data)]
            },
            onError: {
                target: 'welcome',
                actions: (context, event) => console.log(event.data)

                }
            }
        },
        menu: {
            initial: "prompt",
            on: {
                ENDSPEECH: [
                    { target: 'todo', cond: (context) => context.option === 'todo' },
                    { target: 'timer', cond: (context) => context.option === 'timer' },
                    { target: 'appointment', cond: (context) => context.option === 'appointment' }
                ]
            },
            states: {
                prompt: {
                    entry: send((context) => ({
                        type: "SPEAK",
                        value: `OK. I see.`
                    })),
        },
                 nomatch: {
                    entry: say("Sorry, I don't understand"),
                    on: { ENDSPEECH: "prompt" }
        } 
            }       
        },


        todo: {
            initial: "prompt",
            on: { ENDSPEECH: "init" },
            states: {
                prompt: {
                    entry: send((context) => ({
                        type: "SPEAK",
                        value: `Let's create a to do item`
                    }))
                }}
        },
        
        timer: {
            initial: "prompt",
            on: { ENDSPEECH: "init" },
            states: {
                prompt: {
                    entry: send((context) => ({
                        type: "SPEAK",
                        value: `Let's create a timer`
                    }))
                }}
        },
        
        
        appointment: {
            initial: "prompt",
            on: { ENDSPEECH: "who" },
            states: {
                prompt: {
                    entry: send((context) => ({
                        type: "SPEAK",
                        value: `Let's create an appointment`
                    }))
                }}
        },

        who: 
        
        {
            initial: "prompt",
            on: 
            {
                RECOGNISED: 
                [
                    {
                    cond: (context) => "person" in (grammar[context.recResult] || {}),
                    actions: assign((context) => { return { person: grammar[context.recResult].person } }),
                    target: "day"
                    },
                { target: ".nomatch" }
                ]
            },

            states: 
            
            {
                prompt: 
                
                {
                    entry: say("Who are you meeting with?"),
                    on: { ENDSPEECH: "ask" }
                },
                
                ask: 
                
                {
                    entry: listen()
                },
                
                nomatch: 
                
                {
                    entry: say("Sorry I don't know them"),
                    on: { ENDSPEECH: "prompt" }
                }
            }
        },

        day: 
        
        {
            initial: "prompt",
            on: 
            
            {
	            RECOGNISED: 
                [
                    {
	                cond: (context) => "day" in (grammar[context.recResult] || {}),
		            actions: assign((context) => { return { day: grammar[context.recResult].day } }),
		            target: "wholeday"

		            },	

		            { target: ".nomatch" }
                
                ]
	        },

            states: 

            {
                prompt: 
                
                {
                    entry: send((context) => ({
                        type: "SPEAK",
                        value: `OK. ${context.person}. On which day is your meeting?`
                    })),
		            on: { ENDSPEECH: "ask" }
                },
		        ask: 
                
                {
		            entry: listen()
	            },

		        nomatch: 
                
                {
		            entry: say("Sorry I don't know which day are you talking about"),
		            on: { ENDSPEECH: "prompt" }
	            }	     
            }
        },


	    wholeday: 
        
        {
		        initial: "prompt",
		        on: 
                
                {
	                RECOGNISED: 
                    
                    [
                        {cond: (context) => grammar2[context.recResult] === true,
                        target: "timefixed"},

						{cond: (context) => grammar2[context.recResult] === false,
						target: "settime"},

	                { target: ".nomatch" }
                    ]
		        
                },


		        states: 
                
                {
		            prompt: 
                    
                    {
			            entry: send((context) => ({
			                type: "SPEAK",
						    value: `Good. Appointment is on ${context.day}. Will it take the whole day?`
			            })),
			            on: { ENDSPEECH: "ask" }
		            },

		            ask: {
		                entry: listen()
		            },

		            nomatch: 

                    {
			            entry: say("Please repeat it again"),
		                on: { ENDSPEECH: "prompt" }
		            }
		        }	     
        },


            timefixed: 
            
            {
		           initial: "prompt",

	               on: 
                   
                   {
		               RECOGNISED: 
                       
                       [
                           {cond: (context) => grammar2[context.recResult] === true,
			               target: "Finished"},
						   {cond: (context) => grammar2[context.recResult] === false,
                           target: "who"},
		                   { target: ".nomatch" }
                        ]
		            },



		            states: 
                    
                    {
		                prompt: 
                        
                        {
			                entry: send((context) => ({
			                    type: "SPEAK",
								value: `Good. Do you want to me create an appointment with ${context.person} on ${context.day}for the whole day?`
                            })),
                            on: { ENDSPEECH: "ask" }
		                },


		                ask: 
                        
                        {
			                entry: listen()
		                },

		                nomatch: 
                        
                        {
			                entry: say("Please repeat it again"),
			                on: { ENDSPEECH: "prompt" }
		                }
                    }
	        },

			settime: 
                
                    {

					    initial: "prompt",
					    on: 
                    
                    {
						RECOGNISED: 
                        [
                            {
							
                            cond: (context) => "time" in (grammar[context.recResult] || {}),
							actions: assign((context) => { return { time: grammar[context.recResult].time }}),
							target: "withtime"

						    },

						    { target: ".nomatch" }
                        ]
					},


					    states: 

                        {
						    prompt: { entry: say("What time is your meeting"),
						    on: { ENDSPEECH: "ask" }
					    },

					ask: 
                    {
						entry: listen()
				    },

				nomatch:
                
                {
					entry: say("Please repeat it again"),
					on: { ENDSPEECH: "prompt" }
				}
			            }
		                
                    },


		withtime: 
        
        {
			initial: "prompt",
			on: 
            
            {
				RECOGNISED: 
                [
                    
                    { 
					cond: (context) => grammar2[context.recResult] === true,
					target: "Finished"
                    },
					{
					cond: (context) => grammar2[context.recResult] === false,
					target: "who"
				    },
				    { target: ".nomatch" }
                ]
			},


			 states: 
             
            {
				 prompt: 
                 
                 {
					 entry: send((context) => ({
						 type: "SPEAK",
						 value: `Good. Do you want to me create an appointment with ${context.person} on ${context.day} at ${context.time}?`
					 })),
					 on: { ENDSPEECH: "ask" }
				 },

				 ask: 
                {
					 entry: listen()
				},

				 nomatch: 
                 
                 {
					 entry: say("Please repeat it again"),
					 on: { ENDSPEECH: "prompt" }
				 }
			}
		},

                Finished: 
                
                {
		                 initial: "prompt",
		                 on: { ENDSPEECH: "init" },
		                 states: 
                        {
			                 prompt: { entry: say("Your appointment has been created!")},
	                    }
	            }	    
    }

})






//the api for rasa to use
const proxyurl = "https://cors-anywhere.herokuapp.com/"; // have to set up temporary permission/access for the robot to not give error: "Unexpected token S in JSON at position 0"
const rasaurl = "https://intents-oyousuf.herokuapp.com/model/parse"
const nluRequest = (text: string) =>
    fetch(new Request(proxyurl + rasaurl, {
        method: "POST",
        headers: { "Origin": "http://localhost:3000/react-xstate-colourchanger" },
        body: `{"text": "${text}"}`
    }))
        .then(data => data.json());


