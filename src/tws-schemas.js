// VERSION: 1.7.3

import * as yup from 'yup'

yup.addMethod(yup.mixed, 'defined', function () {
  return this.test(
    'defined',
    '${path} must be defined', // eslint-disable-line no-template-curly-in-string
    value => value !== undefined
  )
})

export const twsDeviceMessage = yup
  .object()
  .shape({
    deviceType: yup.string().required(),
    serialNumber: yup
      .number()
      .strict()
      .required(),
    timestamp: yup.string().required(),
    productCode: yup.string(),
    firmwareVersion: yup.string(),
    imei: yup.string(),
    iccid: yup.string(),
    sigfoxDeviceId: yup.string(),
    techData: yup
      .array()
      .of(
        yup.object().shape({
          timestamp: yup.string().required(),
          sequenceNumber: yup
            .number()
            .strict()
            .required(),
          internalBatteryVoltage: yup.number().strict(),
          externalVoltage: yup.number().strict(),
          solarCellVoltage: yup.number().strict(),
          internalTemperature: yup.number().strict(),
          gsmSignalStrength: yup.number().strict(),
          rssi: yup.number().strict(),
          snr: yup.number().strict(),
          gps: yup.object().shape({
            timestamp: yup.string().required(),
            altitude: yup
              .number()
              .strict()
              .required(),
            flags: yup
              .number()
              .strict()
              .required(),
            groundSpeed2D: yup
              .number()
              .strict()
              .required(),
            heading2D: yup
              .number()
              .strict()
              .required(),
            latitude: yup
              .number()
              .strict()
              .required(),
            longitude: yup
              .number()
              .strict()
              .required(),
            pdop: yup
              .number()
              .strict()
              .required(),
            positionAccuracy: yup
              .number()
              .strict()
              .required(),
            speedAccuracy: yup
              .number()
              .strict()
              .required()
          })
        })
      )
      .defined(),
    probeData: yup
      .array()
      .of(
        yup.object().shape({
          probeId: yup
            .number()
            .strict()
            .required(),
          timestamp: yup.string().required(),
          sequenceNumber: yup
            .number()
            .strict()
            .required(),
          moistures: yup
            .array()
            .of(yup.number().strict())
            .defined(),
          temperatures: yup
            .array()
            .of(yup.number().strict())
            .defined(),
          rainTips: yup.number().strict()
        })
      )
      .defined()
  })
  .required()
  .noUnknown()

/**
 * Validate using schema and format error.
 */
const validate = (schema, params) => {
  try {
    schema.validateSync(params, {
      strict: true,
      abortEarly: false
    })
    return null
  } catch (err) {
    if (err instanceof yup.ValidationError) {
      if (
        err.message ===
        'this field cannot have keys not specified in the object shape'
      ) {
        return 'invalid keys on object'
      }
      return err.inner.reduce((acc, inner) => {
        // remove path from message
        const key = inner.path || '_'
        acc[key] =
          inner.message.split(' ')[0] === key
            ? inner.message
              .split(' ')
              .slice(1)
              .join(' ')
            : inner.message
        return acc
      }, {})
    } else {
      throw err
    }
  }
}

export const validateTWSDeviceMessage = params =>
  validate(twsDeviceMessage, params)
