# ── Permissions ───────────────────────────────────────────────────────────────
# Custom DRF permission classes, shared by every view module.
#
# The role ladder is pending → member → admin, defined on the User model.
# Views attach these with `permission_classes = [IsMember]`.

from rest_framework import permissions


class IsMember(permissions.BasePermission):
    """Approved members and admins only. Blocks pending accounts."""

    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.is_member


class IsAdmin(permissions.BasePermission):
    """Admins only."""

    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.is_admin
