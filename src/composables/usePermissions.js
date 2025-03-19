// src/composables/usePermissions.js
import { computed } from 'vue'

export function usePermissions() {
    // Check if user has specific permission
    const hasPermission = (permission) => {
        const permissions = JSON.parse(localStorage.getItem('permissions') || '[]')
        return permissions.includes(permission)
    }

    // Check if user has any of the specified permissions
    const hasAnyPermission = (permissions) => {
        return permissions.some(permission => hasPermission(permission))
    }

    // Check if user has all of the specified permissions
    const hasAllPermissions = (permissions) => {
        return permissions.every(permission => hasPermission(permission))
    }

    // Check if user is a teacher
    const isTeacher = computed(() => {
        const roles = JSON.parse(localStorage.getItem('roles') || '[]')
        return roles.includes('tea')
    })

    // Check if user is a student
    const isStudent = computed(() => {
        const roles = JSON.parse(localStorage.getItem('roles') || '[]')
        return roles.includes('stu')
    })

    // Check if user can manage knowledge bases
    const canManageKnowledgeBases = computed(() => {
        return hasAnyPermission(['deepSeek:dataset:add', 'deepSeek:dataset:delete'])
    })

    // Check if user can manage documents
    const canManageDocuments = computed(() => {
        return hasAnyPermission([
            'deepSeek:document:add',
            'deepSeek:document:update',
            'deepSeek:document:delete',
            'deepSeek:document:createByFile'
        ])
    })

    return {
        hasPermission,
        hasAnyPermission,
        hasAllPermissions,
        isTeacher,
        isStudent,
        canManageKnowledgeBases,
        canManageDocuments
    }
}
