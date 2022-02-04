import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';

import {action} from "@storybook/addon-actions";
import {AppWithRedux} from './AppWithRedux';
import { ReduxStoreProviderDecorator } from './stories/decorators/ReduxStoreProviderDecorator';

export default {
    title: 'Todolist/AppWithRedux',
    component: AppWithRedux,
    argTypes: {},
    decorators: [ReduxStoreProviderDecorator]
} as ComponentMeta<typeof AppWithRedux>;


const Template: ComponentStory<typeof AppWithRedux> = (args:any) => <AppWithRedux {...args} />;

export const AppWithReduxStory = Template.bind({});

AppWithReduxStory.args = {
    addItem: action('AddItemFormStory')
};
