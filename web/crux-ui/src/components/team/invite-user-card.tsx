import DyoButton from '@app/elements/dyo-button'
import { DyoCard } from '@app/elements/dyo-card'
import { DyoHeading } from '@app/elements/dyo-heading'
import { DyoInput } from '@app/elements/dyo-input'
import { DyoLabel } from '@app/elements/dyo-label'
import { defaultApiErrorHandler } from '@app/errors'
import { ActiveTeamDetails, InviteUser, User } from '@app/models'
import { teamUsersApiUrl } from '@app/routes'
import { sendForm } from '@app/utils'
import { inviteUserSchema } from '@app/validations'
import { useFormik } from 'formik'
import useTranslation from 'next-translate/useTranslation'
import { MutableRefObject } from 'react'

interface InviteUserCardProps {
  className?: string
  team: ActiveTeamDetails
  onUserInvited: (product: User) => void
  submitRef?: MutableRefObject<() => Promise<any>>
}

const InviteUserCard = (props: InviteUserCardProps) => {
  const { team, className, onUserInvited, submitRef } = props

  const { t } = useTranslation('teams')

  const handleApiError = defaultApiErrorHandler(t)

  const formik = useFormik({
    validationSchema: inviteUserSchema,
    initialValues: {
      email: '',
    },
    onSubmit: async (values, { setSubmitting, setFieldError }) => {
      setSubmitting(true)

      const res = await sendForm('POST', teamUsersApiUrl(team.id), values as InviteUser)

      if (res.ok) {
        const json = await res.json()
        const user = json as User

        onUserInvited(user)
      } else {
        handleApiError(res, setFieldError)
      }

      setSubmitting(false)
    },
  })

  if (submitRef) {
    submitRef.current = formik.submitForm
  }

  return (
    <DyoCard className={className}>
      <DyoHeading element="h4" className="text-lg text-bright">
        {t('inviteMember', { name: team.name })}
      </DyoHeading>

      <DyoLabel textColor="text-bright-muted">{t('tips')}</DyoLabel>

      <form className="flex flex-col" onSubmit={formik.handleSubmit} onReset={formik.handleReset}>
        <DyoInput
          className="max-w-lg"
          grow
          name="email"
          type="email"
          required
          label={t('common:email')}
          onChange={formik.handleChange}
          value={formik.values.email}
          message={formik.errors.email}
        />

        <DyoButton className="hidden" type="submit" />
      </form>
    </DyoCard>
  )
}

export default InviteUserCard
