import { MachineConfig, send, Action, assign } from "xstate";


function say(text: string): Action<SDSContext, SDSEvent> {
    return send((_context: SDSContext) => ({ type: "SPEAK", value: text }))
}

function listen(): Action<SDSContext, SDSEvent> {
    return send('LISTEN')
}

const grammar: { [index: string]: { person?: string, day?: string, time?: string } } = {
    "John": { person: "John Appleseed" },
	"Chris": { person: "Chris Thomas" },
	"Grace": {person: "Grace Jane"},
    "on Friday": { day: "Friday" },
	"on Monday": { day: "Monday" },
	"at8": {time: "eight o'clock" },
	"at eight": { time: "eight o'clcok" },
	"at10":{time:"ten o'clcok" },
    "at ten": { time: "ten o'clcok" },
	"at7": {time: "seven o'clock"},
    "at seven": {time: "seven o'clock"},
	"at11": {time: "eleven o'clock"},
    "at eleven": {time: "eleven o'clock"}
}

const grammar2= { "yes": true,
                  "Yes": true,
				  "Of course": true,
                  "of course": true, 
				  "No": false,
				  "no" : false,
				  "No way": false,
				  "no way" : false
}

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
            on: { ENDSPEECH: "who" },
            states: {
                prompt: { entry: say("Let's create an appointment") }
            }
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
                    entry: say("Sorry I don't know them"),
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
                        value: `OK. ${context.person}. On which day is your meeting?`
                    })),
		            on: { ENDSPEECH: "ask" }
                },
		        ask: {
		            entry: listen()
	            },
		        nomatch: {
		            entry: say("Sorry I don't know which day are you talking about"),
		            on: { ENDSPEECH: "prompt" }
	            }	     
            }
        },
	    wholeday: {
		        initial: "prompt",
		        on: {
	                RECOGNISED: [{
			            cond: (context) => grammar2[context.recResult] === true,
                        target: "notime"},
						{
						cond: (context) => grammar2[context.recResult] === false,
						target: "whattime"

		            },
	                { target: ".nomatch" }]
		        },
		        states: {
		            prompt: {
			            entry: send((context) => ({
			                type: "SPEAK",
						    value: `Good.on ${context.day}. Will it take the whole day?`
			            })),
			            on: { ENDSPEECH: "ask" }
		            },
		            ask: {
		                entry: listen()
		            },
		            nomatch: {
			            entry: say("Please repeat it again"),
		                on: { ENDSPEECH: "prompt" }
		            }
		        }	     
            },
            notime: {
		           initial: "prompt",
	               on: {
		               RECOGNISED: [{ 
			               cond: (context) => grammar2[context.recResult] === true,
			               target: "Finished"},
						   {
							cond: (context) => grammar2["context.recResult"] === false,
                           target: "who"
						   
		                },
		                { target: ".nomatch" }]
		            },
		            states: {
		                prompt: {
			                entry: send((context) => ({
			                    type: "SPEAK",
								value: `Good. Do you want to me create an appointment with ${context.person} on ${context.day}for the whole day?`
                            })),
                            on: { ENDSPEECH: "ask" }
		                },
		                ask: {
			                entry: listen()
		                },
		                nomatch: {
			                entry: say("Please repeat it again"),
			                on: { ENDSPEECH: "prompt" }
		                }
                    }
	            },
				whattime: {
					initial: "prompt",
					on: {
						RECOGNISED: [{
							cond: (context) => "time" in (grammar[context.recResult] || {}),
							actions: assign((context) => { return { time: grammar[context.recResult].time } }),
							target: "withtime"

						},
						{ target: ".nomatch" }]
					},
					states: {
						prompt: { entry: say("What time is your meeting"),
						on: { ENDSPEECH: "ask" }
					},
					ask: {
						entry: listen()
				},
				nomatch: {
					entry: say("Please repeat it again"),
					on: { ENDSPEECH: "prompt" }
				}
			}
		},
		withtime: {
			initial: "prompt",
			on: {
				RECOGNISED: [{ 
					cond: (context) => grammar2[context.recResult] === true,
					target: "Finished"},
					{
					cond: (context) => grammar2[context.recResult] === false,
					target: "who"

				 },
				 { target: ".nomatch" }]
			 },
			 states: {
				 prompt: {
					 entry: send((context) => ({
						 type: "SPEAK",
						 value: `Good. Do you want to me create an appointment with ${context.person} on ${context.day} at ${context.time}?`
					 })),
					 on: { ENDSPEECH: "ask" }
				 },
				 ask: {
					 entry: listen()
				 },
				 nomatch: {
					 entry: say("Please repeat it again"),
					 on: { ENDSPEECH: "prompt" }
				 }
			 }
		},
                Finished: {
		                 initial: "prompt",
		                 on: { ENDSPEECH: "init" },
		                 states: {
			                 prompt: { entry: say("Your appointment has been created!")
		                    },
	                    }
	                }	    
                }
            })
