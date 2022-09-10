import type { NextPage } from 'next'
import Head from 'next/head'
import styles from '@client/assets/styles/Home.module.css'
import { useSession, signIn, signOut } from "next-auth/react"
import { useRouter } from 'next/router'
import { Button, Container, Spinner } from 'react-bootstrap'
import ClientMiddleware from '@client/middleware'
import { useAPI } from '@client/common/hooks/useAPI'
import { trpc } from '@client/common/hooks/useTRPC'

const Home: NextPage = (props) => {
	const router = useRouter()
	const { status, data } = useSession()
	const request = useAPI(`/api/user/${data?.user.id}`, { method: "GET" })
	const handleDeleteThisAccount = (event: any) => {
		event.preventDefault()
		request.call().then((response) => {
			if(response.data.success) {
				// signOut({ redirect: true, callbackUrl: '/api/auth/signin' })
			}
		})
	}

	const requestExample = trpc.useQuery(["auth.getSecretMessage"]);
	

	return (
		<Container>
			<Head>
				<title>Create Next App</title>
				<meta name="description" content="Generated by create next app" />
				<link rel="icon" href="/favicon.ico" />
			</Head>
			<main className="my-5">
				<h1 className={styles.title}>
					Welcome to Home {requestExample.data?.name}
				</h1>
				<h4 className="text-center">{data?.user?.name}</h4>
				<div className="d-flex justify-content-center">
					<div>
						<div className="d-flex justify-content-center"><img src={data?.user.profile_img} className="mb-5"/></div>
						<Button onClick={handleDeleteThisAccount}>{request.loading && (<Spinner animation="border" size="sm"/>)} GET this Account</Button>
					</div>
				</div>
			</main>
		</Container>
	)
}

export const getServerSideProps = ClientMiddleware.roles([1, 3]).redirects({ [3]: '/customer' }).auth()

export default Home
