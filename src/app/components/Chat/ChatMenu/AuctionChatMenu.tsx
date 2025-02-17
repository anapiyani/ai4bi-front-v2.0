import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/Checkbox'
import { Input } from '@/components/ui/input'
import { Skeleton } from '@/components/ui/skeleton'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useRenderMediaContent } from '@/src/app/hooks/useRenderMediaContent'
import { AutoCompleteResponse, ChatParticipants } from '@/src/app/types/types'
import { useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'
import NotificationBell from '../../Alerts/Notification/NotificationBell'
import Icons from '../../Icons'
import useAutoComplete from './hooks/useAutocomplete'
import { useGetChatMedia } from './hooks/useGetChatMedia'
type AuctionChatMenuProps = {
	name: string;
	status: string;
	region: string;
	construction: string;
	project_name: string;
	portal_id: string;
	lot_information: string;
	auction_date: string;
	technical_council_date: string;
	participants: ChatParticipants[];
	t: any;
	addParticipantsToAuctionChat: (user_ids: string[]) => void;
	chatId: string;
}

const AuctionChatMenu = (
	{name, status, region, construction, project_name, portal_id, lot_information, auction_date, technical_council_date, participants, t, addParticipantsToAuctionChat, chatId}
	: AuctionChatMenuProps) => {
	const queryClient = useQueryClient();
	const [openAddParticipant, setOpenAddParticipant] = useState<boolean>(false);
	const { results, handleSearch, setResults, setSearch } = useAutoComplete();
	const [selectedParticipants, setSelectedParticipants] = useState<AutoCompleteResponse[]>([]);
	const [openedTab, setOpenedTab] = useState<"participants" | "image" | "file">("participants");
	const { data: chatMedia, isLoading, isError, refetch } = useGetChatMedia(
		chatId, 
		openedTab === "file" ? "file" : "image"
	);
	const renderedMedia = useRenderMediaContent(chatMedia?.media, t, false, true);
	
	const handleAddParticipants = () => {
		addParticipantsToAuctionChat(selectedParticipants.map((participant) => participant.uuid));
		setOpenAddParticipant(false);
		setSelectedParticipants([]);
	}

	return (
		<div className="flex flex-col gap-4">
			<div className='flex'>
				<p className='text-sm font-medium'>{name}</p>
			</div>
			<div className='flex flex-col gap-0.5'>
				<p className='text-xs text-muted-foreground'>{t("status")}</p>
				<p className='text-xs text-green-500'>{status}</p>
			</div>	
			<div className='flex flex-col gap-0.5'>
				<p className='text-xs text-muted-foreground'>{t("region")}</p>
				<p className='text-xs'>{region}</p>
			</div>
			<div className='flex flex-col gap-0.5'>
				<p className='text-xs text-muted-foreground'>{t("construction")}</p>
				<p className='text-xs'>{construction}</p>
			</div>
			<div className='flex flex-col gap-0.5'>
				<p className='text-xs text-muted-foreground'>{t("project-name")}</p>
				<p className='text-xs'>{project_name}</p>
			</div>
			<div className='flex flex-col gap-0.5'>
				<p className='text-xs text-muted-foreground'>{t("portal-id")}</p>
				<p className='text-xs'>{portal_id}</p>
			</div>
			<div className='flex flex-col gap-0.5'>
				<p className='text-xs text-muted-foreground'>{t("lot-information")}</p>
				<a href='#' className='text-xs text-primary'>{t("go to the table")}</a>
			</div>
			<div>
				<NotificationBell />
			</div>
			<div className='flex flex-col gap-0.5'>
				<p className='text-xs text-muted-foreground'>{t("technical-council-date")}</p>
				<p className='text-xs'>{technical_council_date}</p>
			</div>
			<div className='flex flex-col gap-0.5'>
				<p className='text-xs text-muted-foreground'>{t("auction-date")}</p>
				<p className='text-xs'>{auction_date}</p>
			</div>
			<div>
				<Tabs   value={openedTab}
					onValueChange={(value) => {
						setOpenedTab(value as "participants" | "image" | "file");
						if (value === 'image' || value === 'file') {
							refetch();
						}
					}}
					className="w-full"
				>
					<TabsList className="w-full flex justify-between items-center bg-transparent border-none rounded-none">
						<TabsTrigger
							value="participants"
							className='w-full bg-transparent data-[state=active]:text-primary
												data-[state=active]:border-b-2 data-[state=active]:border-primary
												rounded-none data-[state=active]:bg-transparent'>
							{t("participants")}
						</TabsTrigger>

						<TabsTrigger
							value="image"
							className='w-full bg-transparent data-[state=active]:text-primary
												data-[state=active]:border-b-2 data-[state=active]:border-primary
												rounded-none data-[state=active]:bg-transparent'>
							{t("photo-video")}
						</TabsTrigger>

						<TabsTrigger
							value="file"
							className='w-full bg-transparent data-[state=active]:text-primary
												data-[state=active]:border-b-2 data-[state=active]:border-primary
												rounded-none data-[state=active]:bg-transparent'>
							{t("file")}
						</TabsTrigger>
					</TabsList>
					<TabsContent value="participants">
						{
							!openAddParticipant ? (
								<div className='flex flex-col gap-2 w-full justify-center items-start'>
							{
								participants.map((participant) => (
									<div className='flex flex-col gap-0.5' key={participant.chat_participant_id}>
										<div className='flex items-center gap-2 my-1 justify-center'>
											<div className='w-6 h-6 rounded-full bg-transparent border border-border bg-muted flex items-center justify-center'>
												{participant.username.charAt(0).toUpperCase()}
											</div>
											<p className='text-base'>{participant.username}</p>
										</div>
									</div>
								))
							}
						</div>
							) : (
								<div className='flex flex-col gap-2 w-full justify-center items-start'>
									<div className="flex gap-2 items-center w-full">
										<Input onChange={handleSearch} placeholder={t("search-by-name/email")} />
										<Button disabled={selectedParticipants.length === 0} onClick={handleAddParticipants} className='bg-primary text-white hover:bg-primary/90'>
											<Icons.Plus fill='white' />
										</Button>
									</div>
									<div className='flex flex-col w-full justify-center items-start'>
										{
											selectedParticipants.map((participant) => (
												<div className='flex items-center gap-2 mt-1' key={participant.uuid}>
													<Checkbox checked={true} onCheckedChange={(checked) => {
														if (checked) {
															setSelectedParticipants([...selectedParticipants, participant]);
														} else {
															setSelectedParticipants(selectedParticipants.filter((p) => p.uuid !== participant.uuid));
														}
													}} />
													<p>{participant.first_name} {participant.last_name}</p>
												</div>
											))
										}
										{results.map((result) => (
											<div className='flex items-center mt-1' key={result.uuid}>
												{
													selectedParticipants.some((participant) => participant.uuid === result.uuid) ? (
														null
													) : (
														<div className='flex items-center gap-2'>
															<Checkbox checked={selectedParticipants.some((participant) => participant.uuid === result.uuid)} onCheckedChange={(checked) => {
																if (checked) {
																	setSelectedParticipants([...selectedParticipants, result]);
																} else {
																	setSelectedParticipants(selectedParticipants.filter((participant) => participant.uuid !== result.uuid));
																}
															}} />
															<p>{result.first_name} {result.last_name}</p>
														</div>
													)
												}
											</div>
										))}
									</div>
									<div className='flex flex-col gap-2 w-full justify-center items-start mt-2'>
										<Button variant='outline' onClick={() => {
											setOpenAddParticipant(false);
											setSelectedParticipants([]);
											setResults([]);
											setSearch("");
										}} className='w-full'>{t("back")}</Button>
									</div>
								</div>
							)
						}
					</TabsContent>
          <TabsContent value="image">
            <div className='flex flex-col gap-2 w-full justify-center items-center'>
							{
								chatMedia?.type === "image" && chatMedia?.media.length && chatMedia?.media.length > 0 && !isLoading ? (
									<div className='grid grid-cols-3 gap-2 w-full justify-center items-center'>
										{renderedMedia}
									</div>
								) : (
									<p className='text-sm text-muted-foreground'>{t("there-are-no-photos-or-videos-yet")}</p>
								)
							}
							{
								isLoading && (
									<div className='flex flex-col gap-2 w-full justify-center items-center'>
										<Skeleton className='w-full h-[300px] rounded-lg' />
									</div>
								)
							}
						</div>
          </TabsContent>
          <TabsContent value="file">
            <div className='flex flex-col gap-2 w-full justify-center items-center'>
             {
							chatMedia?.type === "file" && chatMedia?.media.length && chatMedia?.media.length > 0 && !isLoading ? (
								<div className='flex flex-col gap-2 w-full justify-center items-center'>
									{renderedMedia}
								</div>
							) : (
								<p className='text-sm text-muted-foreground'>{t("there-are-no-files-yet")}</p>
							)
						 }
						 {
							isLoading && (
								<div className='flex flex-col gap-2 w-full justify-center items-center'>
									<Skeleton className='w-full h-[300px] rounded-lg' />
								</div>
							)
						 }
            </div>
          </TabsContent>
        </Tabs>
			</div>
			{
				!openAddParticipant && (
					<div className='flex flex-col gap-2 justify-center mt-3'>
						<Button onClick={() => {
							setOpenAddParticipant(true);
						}} className='bg-neutrals-muted-10 hover:bg-neutrals-muted/10 flex items-center gap-1' variant="outline">
							<Icons.Plus />
							{t("add-participant")}
						</Button>
						<Button variant="outline">
							{t("leave-chat")}
						</Button>
					</div>
				)
			}
		</div>
	)
}

export default AuctionChatMenu;