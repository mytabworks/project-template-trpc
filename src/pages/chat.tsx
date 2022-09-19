import type { NextPage } from 'next'
import { Button, Container, Spinner } from 'react-bootstrap'
import ClientMiddleware from '@client/middleware'
import { useAPI } from '@client/common/hooks/useAPI'
import { trpc } from '@client/common/hooks/useTRPC'
import { RoleType } from '@server/model/Role'
import Chatbox from '@client/components/Chatbox'


const Chat: NextPage = (props) => {

	return (
		<Container>
			<Chatbox />
		</Container>
	)
}

export const getServerSideProps = ClientMiddleware.roles([RoleType.ADMIN, RoleType.CLIENT]).redirects({ [RoleType.CLIENT]: '/customer' }).auth()

export default Chat
