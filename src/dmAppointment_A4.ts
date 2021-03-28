import { MachineConfig, send, Action, assign, actions} from "xstate";
import "./styles.scss";
import * as React from "react";
import * as ReactDOM from "react-dom";
import { useMachine, asEffect } from "@xstate/react";
import { inspect } from "@xstate/inspect";

const {cancel}=actions

function say(text: string): Action<SDSContext, SDSEvent> {
    return send((_context: SDSContext) => ({ type: "SPEAK", value: text }))
}

function listen(): Action<SDSContext, SDSEvent> {
    return send('LISTEN')
}

function promptAndAsk(prompt: string, speechprompt:string): MachineConfig<SDSContext, any, SDSEvent> {
    return ({
        initial: "prompt",
        states: {
            prompt: {
                entry: say(prompt),
                on: { ENDSPEECH: "ask" }
            },
            hist: {type: "history"},
            maxspeech: {
                ...speech(speechprompt)
            },
            ask: {
                entry: [listen(), send('MAXSPEECH', {delay: 5000})]
            },
        }})
}


function helpm(prompt: string, name: string): MachineConfig<SDSContext, any, SDSEvent>{
    return ({entry: say(prompt),
             on: {ENDSPEECH: name+".hist" }})
}

function speech(prompt: string): MachineConfig<SDSContext, any, SDSEvent>{
    return ({entry: say(prompt),
             on: {ENDSPEECH: "ask"
            }})
}

const grammar: { [index: string]: { person?: string, day?: string, time?: string } } = {
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

    // Here are names of friends I tried at first, but because they're non-English it was incredibly hard to move forward with the robot so I made the previously mentioned English names above.
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
const grammar2= { "yes": true,
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
const commands = {"help": "h", "Help": "H"}

const grammar3 ={"count": 0}

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
                    cond: (context) => !(context.recResult in commands),
                    actions: [assign((context) => { return { option: context.recResult } }),assign((context) => { grammar3["count"]=0})],
                    
                },
                {target: "help1",
                cond: (context) => context.recResult in commands }],
                MAXSPEECH: [{target:"welcome.maxspeech",
                cond: (context) => grammar3["count"] <= 2,
                actions: assign((context) => { grammar3["count"]=grammar3["count"]+1 } )
                },{target: "#root.dm.init", 
                cond: (context) => grammar3["count"] > 2, 
                actions:assign((context) => { grammar3["count"]=0})}]
            },
            states: {        
                prompt: {
                entry: say("What would you like to do?"),
                on: { ENDSPEECH: "ask" }
            },
            hist: {type: "history"},
               maxspeech: {
                ...speech("You have not responded. What is it you would like to do?")
        },  
            ask: {
                entry: [listen(), send('MAXSPEECH', {delay: 5000})]
            }
        }   
    }, 
    
        help1:{
            ...helpm("Please, tell me what you want to do.","welcome")
        },
		query: {
            invoke: {
                id: "rasa",
                src: (context, event) => nluRequest(context.option),
                onDone: {
                    target: "menu",
                    actions: [assign((context, event) => { return  {option: event.data.intent.name} }),
                    (context: SDSContext, event: any) => console.log(event.data)]
                    
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
                        value: `OK. I understand，you want a ${context.option}.`
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
        who: {
            initial: "prompt",
            on: {
                RECOGNISED: [{
                    cond: (context) => "person" in (grammar[context.recResult] || {}),
                    actions: assign((context) => { return { person: grammar[context.recResult].person } }),
                    target: "day"

                },
                { target: ".nomatch" ,
                 cond: (context) => !(context.recResult in commands),
                 actions: cancel("maxsp")},
                 {target: "help2",
                 cond: (context) => context.recResult in commands}],
                 MAXSPEECH: [{target:"who.maxspeech",
                 cond: (context) => grammar3["count"] <= 2,
                actions: assign((context) => { grammar3["count"]=grammar3["count"]+1 } )
                },{target: "#root.dm.init", 
                cond: (context) => grammar3["count"] > 2, 
                actions:assign((context) => { grammar3["count"]=0})}] 
            },
            states: {
                prompt: {
                    entry: say("Who\re you meeting with?"),
                    on: { ENDSPEECH: "ask" }
                },
                hist: {type: "history"},
                ask: {
                    entry: [listen(), send('MAXSPEECH', {delay: 5000, id: "maxsp"})]
                },
                maxspeech: {
                    ...speech(`You didn't respond. Which person are you meeting with?`)
                },
                nomatch: {
                    entry: say("Sorry I don't know them"),
                    on: { ENDSPEECH:  "prompt" }
                
                }
             }
        },
        help2:{
            ...helpm("Please, tell me the name.","who")
        },
        day: {
            initial: "prompt",
            on: {
	            RECOGNISED: [{
	                cond: (context) => "day" in (grammar[context.recResult] || {}),
		            actions: [assign((context) => { return { day: grammar[context.recResult].day } }),assign((context) => { grammar3["count"]=0}),cancel("maxsp")],
		            target: "wholeday"

		        },	
		        { target: ".nomatch" ,
                cond: (context) => !(context.recResult in commands),
                actions: cancel("maxsp")},
                {target: "help3",
                cond: (context) => context.recResult in commands}],
                MAXSPEECH: [{target:"day.maxspeech",
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
                        value: `OK. ${context.person}. What day is your meeting on?`
                    })),
		            on: { ENDSPEECH: "ask" }
                },
                hist: {type: "history"},
		        ask: {
		            entry: [listen(), send('MAXSPEECH', {delay: 5000, id: "maxsp"})]
	            },
                maxspeech: {
                 ...speech("You have not responded. Please, state a day")
              },
		        nomatch: {
		            entry: say("Sorry, I don't know which day you are talking about."),
		            on: { ENDSPEECH: "prompt" }
	            }	     
            }
        },
        help3:{
            ...helpm("Please tell me the day.","day")
        },
        
	    wholeday: {
		        initial: "prompt",
		        on: {
	                RECOGNISED: [{
			            cond: (context) => grammar2[context.recResult] === true,
                        target: "notime",
                        actions: [ assign((context)=>{ grammar3["count"]=0}), cancel("maxsp")]},
						{
						cond: (context) => grammar2[context.recResult] === false,
						target: "whattime",
                        actions: [ assign((context)=>{ grammar3["count"]=0}), cancel("maxsp")]

		            },
	                { target: ".nomatch",
                    cond: (context) => !(context.recResult in commands),
                    actions: cancel("maxsp")},
                    {target: "help4",
                    cond: (context) => context.recResult in commands}],
                    MAXSPEECH: [{target:"wholeday.maxspeech",
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
						    value: `Good, on ${context.day}. Will it take the whole day?`
			            })),
			            on: { ENDSPEECH: "ask" }
		            },
                    hist: {type: "history"},
		            ask: {
		                entry: [listen(), send('MAXSPEECH', {delay: 5000, id: "maxsp"})]
		            },
                    maxspeech: {
                      ...speech("You did not respond, say a decision")
                    },
		            nomatch: {
			            entry: say("Please repeat it again"),
		                on: { ENDSPEECH: "prompt" }
		            }
		        }	     
            },
            help4:{
                ...helpm("Please tell me the decision","wholeday")
            },
            notime: {
		           initial: "prompt",
	               on: {
		               RECOGNISED: [{ 
			               cond: (context) => grammar2[context.recResult] === true,
			               target: "Finished",
                           actions: [ assign((context)=> { grammar3["count"]=0}), cancel("maxsp")]},
						   {
							cond: (context) => grammar2[context.recResult] === false,
                           target: "who",
                           actions: [ assign((context)=>{ grammar3["count"]=0}), cancel("maxsp")]
						   
		                },
		                { target: ".nomatch",
                        cond: (context) => !(context.recResult in commands),
                        actions: cancel("maxsp")},
                        {target: "help5",
                        cond: (context) => context.recResult in commands}],
                        MAXSPEECH: [{target:"notime.maxspeech",
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
								value: `Great. Do you want to me create an appointment with ${context.person} on ${context.day} for the whole day?`
                            })),
                            on: { ENDSPEECH: "ask" }
		                },
                        hist: {type: "history"},
		                ask: {
			                entry: [listen(), send('MAXSPEECH', {delay: 5000, id: "maxsp"})]
		                },
                        maxspeech: {
                             ...speech("You did not respond, please confirm.")},
		                nomatch: {
			                entry: say("Please repeat it again"),
			                on: { ENDSPEECH: "prompt" }
		                }
                    }
	            },
                help5:{
                    ...helpm("Please confirm it","notime")
                },
				whattime: {
					initial: "prompt",
					on: {
						RECOGNISED: [{
							cond: (context) => "time" in (grammar[context.recResult] || {}),
							actions: [assign((context) => { return { time: grammar[context.recResult].time } }), assign((context) => { grammar3["count"]=0})],
							target: "withtime"

						},
						{ target: ".nomatch" ,
                        cond: (context) => !(context.recResult in commands),
                        actions: cancel("maxsp")},
                        {target: "help6",
                        cond: (context) => context.recResult in commands}],
                        MAXSPEECH: [{target:"whattime.maxspeech",
                        cond: (context) => grammar3["count"] <= 2,
                actions: assign((context) => { grammar3["count"]=grammar3["count"]+1 } )
                },{target: "#root.dm.init", 
                cond: (context) => grammar3["count"] > 2, 
                actions:assign((context) => { grammar3["count"]=0})}]  
					},
					states: {
						prompt: { entry: say("What time is your meeting"),
						on: { ENDSPEECH: "ask" }
					},
                    hist: {type: "history"},
					ask: {
						entry: [listen(), send('MAXSPEECH', {delay: 5000, id: "maxsp"})]
				},
                maxspeech: {
                  ...speech("You did not respond. Please, state a time")
                },
				nomatch: {
					entry: say("Please repeat it again"),
					on: { ENDSPEECH: "prompt" }
				}
			}
		},
        help6:{
            ...helpm("Please, tell me the time","whattime")
        },
        
		withtime: {
			initial: "prompt",
			on: {
				RECOGNISED: [{ 
					cond: (context) => grammar2[context.recResult] === true,
					target: "Finished",
                    actions: assign((context)=>{ grammar3["count"]=0})},
					{
					cond: (context) => grammar2[context.recResult] === false,
					target: "who",
                    actions: [assign((context)=>{ grammar3["count"]=0}), cancel("maxsp")]

				 },
				 { target: ".nomatch",
                 cond: (context) => !(context.recResult in commands),
                 actions: cancel("maxsp")},
                 {target: "help7",
                 cond: (context) => context.recResult in commands}],
                 MAXSPEECH: [{target:"withtime.maxspeech",
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
						 value: `Great. Do you want to me create an appointment with ${context.person} on ${context.day} at ${context.time}?`
					 })),
					 on: { ENDSPEECH: "ask" }
				 },
                 hist: {type: "history"},
				 ask: {
					 entry: [listen(), send('MAXSPEECH', {delay: 5000, id: "maxsp"})]
				 },
                maxspeech: {
                 ...speech("You did not respond, please confirm.")
                },        
				 nomatch: {
					 entry: say("Please repeat it again"),
					 on: { ENDSPEECH: "prompt" }
				 }
			 }
		},
        help7:{
            ...helpm("Please confirm","withtime")
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


			/* RASA API
 *  */
const proxyurl = "https://cors-anywhere.herokuapp.com/";
const rasaurl = "https://intents-oyousuf.herokuapp.com/model/parse"
const nluRequest = (text: string) =>
    fetch(new Request(proxyurl + rasaurl, {
        method: "POST",
        headers: { "Origin": "http://localhost:3000/react-xstate-colourchanger" }, // only required with proxy
        body: `{"text": "${text}"}`
    }))
        .then(data => data.json());
