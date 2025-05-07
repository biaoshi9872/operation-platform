import { ref, onMounted } from 'vue'
import exportTemplate from '@/api/exportTemplate'
import indexedDBHelper from '@/utils/IndexedDB/indexedDBHelper'

export default function (templateType: string) {
  let exportTempleInfo = ref()

  onMounted(() => {
    templateType &&
      exportTemplate.A_getOssUrl({ templateType }).then((res: any) => {
        exportTempleInfo.value = res
      })
  })

  const getExportTempleInfo = (templateType: string) => {
    return exportTemplate.A_getOssUrl({ templateType })
  }

  const getCacheExportTempleInfo = async (templateType: string) => {
    const res = await indexedDBHelper.excelTemplateConfig.excelTemplateQueryByKey(templateType)
    return res
  }

  return {
    getExportTempleInfo,
    getCacheExportTempleInfo,
    exportTempleInfo
  }
}
