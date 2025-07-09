import { Box, Container, Grid, GridCol, Group, Skeleton, Stack, Title } from "@mantine/core";

export default function ArtistLoading() {
	return (
		<Box
			style={{
				background: 'var(--mantine-color-dark-9)',
				minHeight: '100vh',
				color: 'var(--mantine-color-gray-0)',
				margin: 0,
				width: '100%',
				maxWidth: '100vw',
				position: 'relative',
				overflowX: 'hidden'
			}}
		>
			{/* Hero Section Skeleton */}
			<Box style={{ position: 'relative', height: '400px', marginBottom: '-180px' }}>
				<Skeleton
					height={400}
					width="100%"
					style={{
						borderRadius: 0,
					}}
				/>
				<Box
					style={{
						position: 'absolute',
						inset: 0,
						background: 'linear-gradient(to top, var(--mantine-color-dark-9) 0%, rgba(22, 17, 34, 0.5) 30%, transparent 70%)',
					}}
				/>
			</Box>

			{/* Profile Section Skeleton */}
			<Container size="lg" style={{ position: 'relative', zIndex: 10 }}>
				<Stack align="center" gap="md" style={{ textAlign: 'center', paddingTop: '0.5rem' }}>
					{/* Avatar Skeleton */}
					<Skeleton
						circle
						height={192}
						width={192}
						style={{
							border: '4px solid var(--mantine-color-dark-9)',
							boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
						}}
					/>

					{/* Name Skeleton */}
					<Skeleton height={48} width={300} style={{ marginTop: '1rem' }} />

					{/* Bio Skeleton */}
					<Stack gap="xs" style={{ width: '100%', maxWidth: '600px', marginTop: '0.5rem' }} align="center">
						<Skeleton height={18} width="90%" />
						<Skeleton height={18} width="85%" />
						<Skeleton height={18} width="65%" />
					</Stack>

					{/* Location Skeleton */}
					<Group gap="xs" justify="center" style={{ marginTop: '1rem' }}>
						<Skeleton height={16} width={16} circle />
						<Skeleton height={16} width={150} />
					</Group>

					{/* External Links Skeleton */}
					<Group gap="md" justify="center" style={{ marginTop: '1rem' }}>
						<Skeleton height={28} width={80} radius="md" />
						<Skeleton height={28} width={80} radius="md" />
						<Skeleton height={28} width={80} radius="md" />
					</Group>

					{/* Edit Button Skeleton */}
					<Skeleton height={36} width={120} radius="md" style={{ marginTop: '1rem' }} />
				</Stack>

				{/* Tab Navigation Skeleton */}
				<Box mt="xl">
					<Group gap="xl" justify="center" style={{
						borderBottom: '1px solid var(--mantine-color-dark-4)',
						paddingBottom: '1rem',
						marginBottom: '2rem'
					}}>
						<Skeleton height={24} width={60} />
						<Skeleton height={24} width={70} />
						<Skeleton height={24} width={90} />
					</Group>
				</Box>

				{/* Content Area Skeleton - Music Grid Layout */}
				<Container size="md">
					<Title order={2} mb="md">
						<Skeleton height={32} width={180} />
					</Title>
					<Grid gutter="md">
						{[...Array(8)].map((_, index) => (
							<GridCol key={index} span={{ base: 12, xs: 6, sm: 4, md: 3 }}>
								<Box>
									{/* Album Art */}
									<Box style={{ position: 'relative' }}>
										<Skeleton
											height={200}
											width="100%"
											style={{
												aspectRatio: '1',
												borderRadius: '8px'
											}}
										/>
									</Box>
									{/* Track Info */}
									<Stack gap="xs" mt="sm">
										<Skeleton height={16} width="80%" style={{ margin: '0 auto' }} />
										<Skeleton height={14} width="60%" style={{ margin: '0 auto' }} />
									</Stack>
								</Box>
							</GridCol>
						))}
					</Grid>
				</Container>
			</Container>

			{/* Bottom spacing */}
			<div style={{ height: '4rem' }} />
		</Box>
	);
}
