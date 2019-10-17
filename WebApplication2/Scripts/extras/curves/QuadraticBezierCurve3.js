import { Curve } from '../core/Curve.js';
import { QuadraticBezier } from '../core/Interpolations.js';
import { Vector3 } from '../../math/Vector3.js';


function QuadraticBezierCurve3( v0, v1, v2 ) {

	Curve.call( this );

	this.v0 = v0;
	this.v1 = v1;
	this.v2 = v2;

}

QuadraticBezierCurve3.prototype = Object.create( Curve.prototype );
QuadraticBezierCurve3.prototype.constructor = QuadraticBezierCurve3;

QuadraticBezierCurve3.prototype.isQuadraticBezierCurve3 = true;

QuadraticBezierCurve3.prototype.getPoint = function ( t, optionalTarget ) {

	var point = optionalTarget || new Vector3();

	var v0 = this.v0, v1 = this.v1, v2 = this.v2;

	point.set(
		QuadraticBezier( t, v0.x, v1.x, v2.x ),
		QuadraticBezier( t, v0.y, v1.y, v2.y ),
		QuadraticBezier( t, v0.z, v1.z, v2.z )
	);

	return point;

};


export { QuadraticBezierCurve3 };
