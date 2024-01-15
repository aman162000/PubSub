import * as XMPP from 'stanza'
import { Agent, } from 'stanza'
import { environment, transports } from './env'
import { NS_PUBSUB } from 'stanza/Namespaces'
import { NS_MY_PUBSUB } from './utils/pub.sub.plugin'
/**
 *  Good to set log to true in case you are dubugging 
 *  The most common problem is that the connection not getting established or auth failure in that case it silently fails without throwing any errors
 *  set log to true to see the actual problem
 */
export function createClientAndConnect(clientname = 'admin', log = false) {
    const config = {
        jid: `${clientname}@${environment.host}`,
        password: clientname,
        transports: transports,
        allowResumption: false
    }

    const client = XMPP.createClient(config)
    if (log) {
        var inlog = console.log.bind(console, '<<in')
        var outlog = console.log.bind(console, 'out>>')
        client.on('raw:incoming', function (data: any) {
            inlog(data)
        })
        client.on('raw:outgoing', function (data: any) {
            outlog(data.toString())
        })
    }

    client.connect()
    return client
}



export function onStartedSession(params: (ag: Agent) => any, ag: Agent) {
    ag.on('session:started', async () => {
        await ag.getRoster()
        ag.sendPresence()
        ag.enableCarbons()
        params(ag)
    })
    return ag
}