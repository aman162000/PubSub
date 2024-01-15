import { environment } from './env'
import { plugin } from './utils/pub.sub.plugin'
import { createNode } from './utils/create.pubsub.node'
import { subscribe, listenForPublishEvents, publishToNode, getNodeSubscribers } from './utils/pub.sub.helpers'
import { onStartedSession, createClientAndConnect } from "./xmpp.helper"


export async function pubsubExample() {
    onStartedSession(async (ag) => {
        // Use Pubsub Plugin necessary
        ag.use(plugin)
        const nodename = "pubsub_open"
        const pubsub = environment.pubSubService

        await createNode(ag, pubsub, nodename, "publishers")

        //  Let publisher subscribe to his node too
        await subscribe(ag, nodename)
        // listenForPublishEvents(ag)

        // listenMultipleForPublishEvents(nodename)
        // Wait for listenMultipleForPublishEvents to intialize clients

        await publishToNode(ag, pubsub, nodename, 'I am very happy.')

        // Get the settings applied to node when it is created
        const defaultNodeConfig = await ag.getDefaultNodeConfig(pubsub)

        console.log({
            defaultPublisherModel: defaultNodeConfig.fields![13],
            currentPublisherModel: (await ag.getNodeConfig(pubsub, nodename)).fields![13]
        })
        console.log({
            nodename,
            // Configuration of a particular Node
            nodeConfig: await ag.getNodeConfig(pubsub, nodename),
            subs: await
                getNodeSubscribers(ag, nodename),
            disco: (await ag.getDiscoItems()).items,
            defaultConfig: defaultNodeConfig,
        })

    }, createClientAndConnect('admin',true))
}


export async function listenMultipleForPublishEvents(nodename: string) {
    try {
        await Promise.all(['alex', 'bob'].map(async (a) => {
            await onStartedSession(async (ag) => {
                await subscribe(ag, nodename);
                console.log(listenForPublishEvents(ag));
            }, createClientAndConnect(a, false));
        }));
    } catch (error) {
        console.error('Error in listenMultipleForPublishEvents:', error);
    }
}

// listenMultipleForPublishEvents("pubsub-test")
// pubsubExample()