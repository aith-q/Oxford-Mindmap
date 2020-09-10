import React, { useEffect, useState, useContext } from 'react';
import { View, ScrollView, ActivityIndicator } from 'react-native'

import { Card, Icon, Image, Text, Button } from 'react-native-elements'

import { ControlsContext, LocationContext, StoriesContext, StoryFetchStatus } from '../contexts'

export const StoryFloat = (props) => {

    const story = props.story

    const { unlockedSet, getUrl } = useContext(StoriesContext)
    const { location, distanceAdjusted } = useContext(LocationContext)

    const distance = distanceAdjusted(story);
    const inDistance = distance <= 0;

    const makeLockedText = () => {
        if (inDistance) return "Unlock";
        else if (distance === Infinity) return "Cannot unlock without location data.";
        else return `You are ${distance} metres too far to unlock.`;
    }

    const makeButton = (story) => {
        if (unlockedSet.has(story.id)) {
            return (
                <Button
                    title={"View"}
                    onPress={props.view}
                    type='solid'
                />
            )
        }
        else {
            return (
                <Button
                    title={makeLockedText()}
                    onPress={props.unlock}
                    type='clear'
                    disabled={!inDistance}
                />
            )
        }
    }

    const makeImageCard = (story) => {
        const uri = getUrl(story.display_image);
        if (uri === 'noimage') return null;
        else return (
            <Card containerStyle={{ opacity: 0.8, marginTop: 15, padding: 5 }}>
                <Card.Image
                    source={{ uri: uri }}
                    style={{ height: 200, margin: 0 }}
                    resizeMode={'contain'}
                    PlaceholderContent={<ActivityIndicator size='large' />}
                />
            </Card>
        )
    }

    // https://github.com/facebook/react-native/issues/12360
    // iOS press propagation works differently to Android
    // pointerEvents="box-none" resolves the issue
    return (
        <View pointerEvents="box-none" style={{ flex: 1, justifyContent: 'space-between', flexDirection: 'column-reverse' }}>
            <Card containerStyle={{ opacity: 0.8, marginBottom: 15 }}>
                <Card.Title
                    onPress={props.unlock}    // dev hack
                >{story.title}</Card.Title>
                <Text>{story.description}</Text>
                <Card.Divider />
                {makeButton(story)}
            </Card>
            {makeImageCard(story)}
        </View>
    );
}

