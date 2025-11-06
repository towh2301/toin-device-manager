import React, { useState } from 'react';
import { Circle, ScrollView, SizableText, Tabs, XStack } from 'tamagui';
import { AppColors } from '../common/app-color';

const TabFilterProps = {
	filters: [] as string[],
};

export const TabFilter = (props: typeof TabFilterProps) => {
	const [selectedTab, setSelectedTab] = useState(props.filters[0]);

	return (
		<Tabs
			value={selectedTab}
			onValueChange={setSelectedTab}
			orientation="horizontal"
			size="$4"
			height={48}
			unstyled
			width="100%"
		>
			{/* Wrap the tab list inside a ScrollView for horizontal scrolling */}
			<ScrollView
				horizontal
				showsHorizontalScrollIndicator={false}
				contentContainerStyle={{
					paddingHorizontal: 8,
					alignItems: 'center',
				}}
			>
				<Tabs.List
					flexDirection="row"
					gap="$3"
					backgroundColor="$gray5"
					borderRadius={999}
					borderWidth={0}
					flexWrap="nowrap"
				>
					{props.filters.map((filter: string) => (
						<Tabs.Tab
							key={filter}
							value={filter}
							unstyled
							alignItems="center"
							justifyContent="center"
							paddingHorizontal="$3.5"
							paddingVertical="$2"
							backgroundColor={
								filter === selectedTab
									? `${AppColors.primary}`
									: `${AppColors.background}`
							}
							borderRadius={999}
							shadowColor="#000"
							shadowOpacity={0.1}
							borderWidth={1}
							shadowRadius={3}
							shadowOffset={{ width: 0, height: 2 }}
							flexShrink={0}
						>
							<XStack gap="$2" alignItems="center">
								{filter === 'ALL' && (
									<Circle
										size={8}
										backgroundColor="$green10"
									/>
								)}
								<SizableText color={AppColors.primary}>
									{filter}
								</SizableText>
							</XStack>
						</Tabs.Tab>
					))}
				</Tabs.List>
			</ScrollView>
		</Tabs>
	);
};
