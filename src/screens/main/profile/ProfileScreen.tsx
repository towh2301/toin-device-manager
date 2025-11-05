import { useAuthStore } from '@/src/store';
import avatar from '@assets/images/person.png';
import { IdCard, LogOut, Mail, Shield, User } from '@tamagui/lucide-icons';
import React from 'react';
import { Image } from 'react-native';
import {
	Button,
	H3,
	ListItem,
	Separator,
	Spinner,
	Text,
	YGroup,
	YStack,
} from 'tamagui';

// Có thể dùng @tanstack/react-query cho thao tác logout nếu cần gọi API
// Ví dụ: import { useMutation } from '@tanstack/react-query';
// Hoặc chỉ đơn giản là gọi hàm logout từ AuthContext.

const ProfileScreen = () => {
	// Lấy thông tin người dùng và hàm đăng xuất từ Context
	const { user, signOut } = useAuthStore();

	// 💡 Nếu bạn muốn gọi API Logout, bạn sẽ bọc hàm logout
	// bên trong một useMutation và xử lý trạng thái loading/error tại đây.

	const handleLogout = () => {
		signOut();
	};

	if (!user) {
		return (
			<YStack
				fullscreen
				flex={1}
				alignItems="center"
				justifyContent="center"
				gap="$4"
			>
				<Spinner size="large" color="$blue10" />
				<Text>Đang tải hồ sơ...</Text>
			</YStack>
		);
	}

	return (
		// YStack là View của Tamagui (theo chiều dọc)
		<YStack
			flex={1}
			padding="$4"
			backgroundColor="$backgroundSoft"
			alignContent="center"
			justifyContent="center"
			gap="$4"
		>
			<H3 textAlign="center" marginBottom="$5" color="$color12">
				👤 Hồ Sơ Người Dùng
			</H3>
			<YStack
				alignSelf="center"
				justifyContent="center"
				alignItems="center"
				width={150}
				height={150} // Add height to make it truly circular
				borderRadius={9999}
				overflow="hidden"
				borderWidth={1}
				borderColor="$primary" // Use Tamagui token
				backgroundColor="$gray8"
				marginBottom={30}
			>
				{/* <Image
					source={require('../../assets/images/avatar.png')}
					width="100%"
					height="100%"
					objectFit="cover" // Better than objectFit="contain" for avatars
				/> */}
				<Image
					source={avatar}
					style={{ width: '100%', height: '100%' }}
					resizeMode="cover"
				/>
			</YStack>

			{/* YGroup giúp tạo danh sách với style thống nhất (như List Item) */}
			<YGroup
				alignSelf="center"
				width="100%"
				size="$4"
				separator={<Separator />}
			>
				{/* 1. Tên đăng nhập */}
				<ListItem
					icon={User}
					title="Tên Đăng Nhập"
					subTitle={user.username}
				></ListItem>

				{/* 2. Email */}
				<ListItem
					icon={Mail}
					title="Email"
					subTitle={user.email}
				></ListItem>

				{/* 3. Vai trò */}
				<ListItem
					icon={Shield}
					title="Vai Trò"
					subTitle={user.role.join(', ')}
				></ListItem>

				{/* 4. ID Người dùng (Có thể ẩn nếu không cần thiết) */}
				<ListItem
					icon={IdCard}
					title="ID"
					subTitle={user.id}
				></ListItem>
			</YGroup>

			{/* Nút Đăng xuất */}
			<Button
				marginTop="$6"
				size="$5"
				minHeight={50}
				theme="red" // Sử dụng theme màu đỏ cho hành động nguy hiểm
				icon={LogOut}
				onPress={handleLogout}
			>
				ĐĂNG XUẤT
			</Button>
		</YStack>
	);
};

export default ProfileScreen;
