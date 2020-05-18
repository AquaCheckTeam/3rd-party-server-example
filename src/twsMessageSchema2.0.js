// VERSION: 2.0

import * as yup from 'yup'

yup.addMethod(yup.mixed, 'defined', function () {
  return this.test(
    'defined',
    '${path} must be defined', // eslint-disable-line no-template-curly-in-string
    value => value !== undefined
  )
})

const mustBe20 = value => {
  return value === '2.0'
}

export const schema = yup
  .object()
  .shape({
    version: yup.mixed()
      .test(
        'is-2.0',
        'must be "2.0"',
        mustBe20
      ).required(),
    device: yup
      .object()
      .shape({
        type: yup.string().required(),
        id: yup.string().required(),
        timestamp: yup.string().required(),
        productCode: yup.string(),
        firmwareVersion: yup.string(),
        imei: yup.string(),
        iccid: yup.string(),
        data: yup
          .array()
          .of(yup.object().shape({
            timestamp: yup.string().required(),
            sequenceNumber: yup.number().strict(),
            internalBatteryVoltage: yup.number().strict(),
            externalVoltage: yup.number().strict(),
            solarCellVoltage: yup.number().strict(),
            internalTemperature: yup.number().strict(),
            gsmSignalStrength: yup.number().strict(),
            rssi: yup.number().strict(),
            snr: yup.number().strict(),
            gps: yup.object().shape({
              timestamp: yup.string().required(),
              altitude: yup.number().strict().required(),
              flags: yup.number().strict().required(),
              groundSpeed2D: yup.number().strict().required(),
              heading2D: yup.number().strict().required(),
              latitude: yup.number().strict().required(),
              longitude: yup.number().strict().required(),
              pdop: yup.number().strict().required(),
              positionAccuracy: yup.number().strict().required(),
              speedAccuracy: yup.number().strict().required()
            })
          })
          )
      }),
    probeData: yup
      .array()
      .of(
        yup.object().shape({
          timestamp: yup.string().required(),
          probeId: yup.string().required(),
          sequenceNumber: yup.number().strict(),
          moistures: yup.array().of(yup.number().strict()).defined(),
          temperatures: yup.array().of(yup.number().strict()).defined(),
          aux: yup.array().of(yup.array().of(yup.number().strict().nullable()).defined()),
          analog: yup.array().of(yup.number().strict().nullable()),
          counter: yup.array().of(yup.number().strict().nullable())
        })
      )
  })
  .required()
  .noUnknown()

export const validate = (message) => {
  try {
    schema.validateSync(message, {
      strict: true,
      abortEarly: false
    })
    return null
  } catch (err) {
    if (err instanceof yup.ValidationError) {
      // if (
      //   err.message ===
      //   'this field cannot have keys not specified in the object shape'
      // ) {
      //   return 'invalid keys on object'
      // }
      console.error(err)
      return err.inner.reduce((acc, inner) => {
        // remove path from message
        const key = inner.path || '{}'
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
