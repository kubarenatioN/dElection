import { FC, useEffect, useState } from "react"
import { IParty } from "../../models/party.model"
import { Alert, Button, Container, Dialog, DialogTitle, FormControl, InputLabel, MenuItem, Select, SelectChangeEvent, Stack } from "@mui/material"
import useId from "@mui/material/utils/useId"

interface VoteProps {
	parties: IParty[]
  vote?: { party: string } | null;
	onVote: (partyId: number) => void
	onUnvote: () => void
  loading?: boolean
}

const Vote: FC<VoteProps> = ({ parties, vote, onVote, onUnvote, loading }) => {
	const [party, setParty] = useState<string>("")
	const [unvoteDialog, setUnvoteDialog] = useState(false)
	// const [loading, setLoading] = useState(false)

	const handleChange = (event: SelectChangeEvent) => {
		setParty(event.target.value)
	}

	const handleVote = () => {
		if (!party) {
			return
		}
    // setLoading(true);
		onVote(Number(party))
	}

  const unvoteDialogClose = (result?: 'unvote') => {
    if (result && result === 'unvote') {
      // setLoading(true);
      onUnvote();
    }
    setUnvoteDialog(false);
  }

	const selectLabelId = useId()

	return (
		<Stack height={'100%'}>
			<h3>Your vote</h3>
			{
        vote === undefined 
          ? <div>
            <p>Loading...</p>
          </div> 
          : vote !== null 
          ? (
            <Stack useFlexGap gap={1} flexGrow={1}>
              <Alert variant="outlined"
                severity="success">
                You voted for "{vote.party}" party.
              </Alert>
              <Button 
                variant='outlined' 
                sx={{
                  mt: 'auto',
                  alignSelf: 'flex-start'
                }} 
                disabled={loading}
                onClick={() => setUnvoteDialog(true)}>
                Unvote
              </Button>
              <UnvoteDialog open={unvoteDialog} onClose={unvoteDialogClose} />
            </Stack>
          ) 
          : (
            <Stack useFlexGap gap={2} sx={{
              maxInlineSize: 300
            }}>
              <FormControl disabled={loading}>
                <InputLabel id={selectLabelId}>Party</InputLabel>
                <Select labelId={selectLabelId} id="demo-simple-select" 
                  value={party} 
                  label="Party" 
                  onChange={handleChange}>
                  {parties.map((p) => {
                    return (
                      <MenuItem key={p.id} value={p.id}>
                        {p.name}
                      </MenuItem>
                    )
                  })}
                </Select>
              </FormControl>

              <Button variant="contained" 
                onClick={handleVote}
                sx={{
                  alignSelf: 'flex-end'
                }}
                disabled={loading}>
                Vote
              </Button>
            </Stack>
          )
      }
		</Stack>
	)
}

interface UnvoteDialogProps {
  open: boolean;
  onClose: (value?: 'unvote') => void;
}

function UnvoteDialog(props: UnvoteDialogProps) {
  const { onClose, open } = props;

  const handleClose = () => {
    onClose();
  };

  const handleSubmit = () => {
    onClose('unvote');
  }

  return <Dialog onClose={handleClose} open={open}>
    <DialogTitle p={2}>Unvote</DialogTitle>
    <Container maxWidth={false} sx={{
      padding: '0 2rem'
    }}>
      <p>Are you sure you want to unvote?</p>
    </Container>
    <Stack direction={'row'} gap={1} justifyContent={'flex-end'} px={3} py={2}>
      <Button onClick={handleClose} size='small' variant='outlined'>
        Cancel
      </Button>
      <Button onClick={handleSubmit} size='small' variant='contained'>
        Unvote
      </Button>
    </Stack>
  </Dialog>
}

export default Vote
