import { registerDecorator, ValidationOptions, ValidationArguments } from 'class-validator';
import { VentanasOperacion } from '../interfaces/ventana.interface';
import { VentanaValidator } from '../validators/ventana.validator';

export function IsValidVentanas(validationOptions?: ValidationOptions) {
  return function (object: any, propertyName: string) {
    registerDecorator({
      name: 'isValidVentanas',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: any, args: ValidationArguments) {
          if (!value || typeof value !== 'object') {
            return false;
          }

          const ventanas = value as VentanasOperacion;
          const validation = VentanaValidator.validateVentanasConsistency(ventanas);
          
          return validation.isValid;
        },
        defaultMessage(args: ValidationArguments) {
          const ventanas = args.value as VentanasOperacion;
          if (!ventanas) {
            return 'Las ventanas son obligatorias';
          }

          const validation = VentanaValidator.validateVentanasConsistency(ventanas);
          return validation.errors.join('; ');
        },
      },
    });
  };
}

export function IsValidTimeFormat(validationOptions?: ValidationOptions) {
  return function (object: any, propertyName: string) {
    registerDecorator({
      name: 'isValidTimeFormat',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: any, args: ValidationArguments) {
          if (typeof value !== 'string') {
            return false;
          }
          
          const timeRegex = /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/;
          return timeRegex.test(value);
        },
        defaultMessage(args: ValidationArguments) {
          return 'El formato de hora debe ser HH:mm (ej: 09:00, 17:30)';
        },
      },
    });
  };
}
