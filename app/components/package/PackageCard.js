/**
 * PackageCard component
 */

import { withStyles } from 'material-ui/styles'
import {
  APP_MODES,
  APP_ACTIONS,
  PACKAGE_GROUPS,
  APP_INFO
} from 'constants/AppConstants'
import { contains, find, propEq } from 'ramda'
import { CardContent as MuiCardContent } from 'material-ui/Card'
import packageCardStyles from 'styles/packageCardStyles'
import React from 'react'
import classnames from 'classnames'
import PropTypes from 'prop-types'
import Card from 'material-ui/Card'
import Divider from 'material-ui/Divider'
import Collapse from 'material-ui/transitions/Collapse'
import Typography from 'material-ui/Typography'
import CardHeader from './CardHeader'
import CardContent from './CardContent'
import CardActions from './CardActions'
import CardDetails from './CardDetails'

const { object, string } = PropTypes

class PackageCard extends React.Component {
  constructor(props) {
    super(props)
  }
  componentDidMount() {
    const {
      expanded,
      packageJSON,
      active,
      mode,
      setPackageGroup,
      clearCommandOptions,
      addCommandOption,
      toggleExpanded
    } = this.props

    clearCommandOptions()

    if (mode === APP_MODES.LOCAL && active) {
      let found = false

      Object.keys(PACKAGE_GROUPS).some((groupName, idx) => {
        found =
          packageJSON[groupName] && packageJSON[groupName][active.name]
            ? groupName
            : false
        if (found) {
          setPackageGroup(groupName)
          return found
        }
      })

      //save-exact fix
      const { group } = this.props
      const symbols = ['~', '^']

      if (group) {
        const pkgVersion = packageJSON[group][active.name]
        if (pkgVersion && !contains(pkgVersion[0], symbols)) {
          addCommandOption('save-exact')
        }
      }
    }
  }
  render() {
    const {
      active,
      classes,
      cmdOptions,
      mode,
      version,
      addCommandOption,
      removeCommandOption,
      clearCommandOptions,
      onChangeVersion,
      group,
      toggleExpanded,
      toggleLoader,
      toggleMainLoader,
      expanded,
      defaultActions,
      toggleSnackbar,
      directory,
      actions,
      setActive,
      settings,
      packageJSON,
      packages
    } = this.props

    return (
      <section className={classes.root}>
        <Card className={classes.card} raised={true}>
          <CardHeader active={active} mode={mode} group={group} />
          <CardContent
            version={version}
            active={active}
            cmdOptions={cmdOptions}
            onChangeVersion={onChangeVersion}
            addCommandOption={addCommandOption}
            removeCommandOption={removeCommandOption}
            clearCommandOptions={clearCommandOptions}
            mode={mode}
            group={group}
            packageJSON={packageJSON}
            fetchGithub={settings && settings.fetchGithub}
            toggleMainLoader={toggleMainLoader}
          />
          <CardActions
            isInstalled={find(propEq('name', active.name))(packages)}
            active={active}
            handleExpandClick={toggleExpanded}
            expanded={expanded}
            setActive={setActive}
            toggleLoader={toggleLoader}
            actions={actions}
            expanded={expanded}
            defaultActions={defaultActions}
            toggleSnackbar={toggleSnackbar}
            mode={mode}
            version={version}
            directory={directory}
            cmdOptions={cmdOptions}
          />
          <Collapse in={expanded} timeout="auto" unmountOnExit>
            <MuiCardContent>
              <Typography
                component="h3"
                variant="title"
                className={classes.heading}
              >
                Distribution
              </Typography>
              <Divider />
              <CardDetails dist={active && active.dist} />
            </MuiCardContent>
          </Collapse>
        </Card>
      </section>
    )
  }
}

PackageCard.propTypes = {
  active: object.isRequired,
  classes: object.isRequired,
  mode: string.isRequired
}

export default withStyles(packageCardStyles)(PackageCard)
