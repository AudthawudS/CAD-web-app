/// <reference path="../_reference.d.ts" />

class BoundCondition
{
    DisplayName: string;

    ConditionType: string;

    Id: string;
}

class BoundConditionNodalLoad extends BoundCondition
{
    XDirection: number;

    YDirection: number;

    ZDirection: number;
}

class BoundConditionDisplacement extends BoundCondition
{
    XDirection: number;

    YDirection: number;

    ZDirection: number;
}

class BoundConditionMoment extends BoundCondition
{
    XMoment: number;

    YMoment: number;

    ZMoment: number;
}

class BoundConditionFixed extends BoundCondition
{
    IsXDirEnabled: boolean;

    IsYDirEnabled: boolean;

    IsZDirEnabled: boolean;

    IsXRotEnabled: boolean;

    IsYRotEnabled: boolean;

    IsZRotEnabled: boolean;
}