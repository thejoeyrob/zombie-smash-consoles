# One-time setup (owner)

## 1. Repositories
Create two empty **private** repositories under `thejoeyrob` (GitHub > New repository, no README, no licence):
- `zombie-smash-game`
- `zombie-smash-consoles`

Then tell Claude. It pushes the prepared code, the tag `v7.62.4` and the workflows.

## 2. Let the consoles read the game (private repo)
1. GitHub > Settings > Developer settings > Personal access tokens > **Fine-grained tokens** > Generate.
2. Resource owner: `thejoeyrob`. Repository access: **only** `zombie-smash-game`. Permission: **Contents: Read-only**. Expiry: 1 year (put the renewal date in your calendar).
3. In `zombie-smash-consoles`: Settings > Secrets and variables > Actions > New repository secret. Name `GAME_REPO_TOKEN`, value = the token.

## 3. Android signing and Play (see `docs/ANDROID-PLAY-SETUP.md`)
The upload key is created once and stored as four secrets. Back it up outside GitHub too.
